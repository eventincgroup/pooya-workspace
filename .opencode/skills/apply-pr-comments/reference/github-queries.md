# GitHub queries for `apply-pr-comments`

All calls go through `gh`. **Always pass the repo explicitly** — `gh` run from the
workspace root resolves to `eventincgroup/pooya-workspace`, not the sub-repo you
mean.

Throughout: `OWNER=eventincgroup`, `REPO` is the sub-directory name, `N` is the PR
number.

---

## 1. Find the PR for a repo's current branch

```bash
BRANCH=$(git -C "$REPO" branch --show-current)
gh pr list --repo "$OWNER/$REPO" --head "$BRANCH" --state open \
  --json number,title,url,headRefName,author
```

Empty array means no open PR for that branch. Run it per sub-repo when the user
didn't name one.

To go the other way — a PR number whose repo you already know:

```bash
gh pr view "$N" --repo "$OWNER/$REPO" --json number,title,url,headRefName,state,isDraft
```

---

## 2. Fetch every comment surface

One query, four surfaces. `reviewThreads` is the only place `isResolved` and
`isOutdated` exist — the REST endpoint `pulls/{n}/comments` does **not** carry
them, which is why this is GraphQL.

```bash
gh api graphql \
  -F owner="$OWNER" -F repo="$REPO" -F number="$N" \
  -f query='
query($owner:String!, $repo:String!, $number:Int!) {
  repository(owner:$owner, name:$repo) {
    pullRequest(number:$number) {
      number
      title
      url
      body
      headRefName
      baseRefName
      reviewDecision
      author { login }

      reviewThreads(first: 100) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          isResolved
          isOutdated
          isCollapsed
          path
          line
          startLine
          originalLine
          diffSide
          comments(first: 50) {
            totalCount
            nodes {
              databaseId
              url
              body
              createdAt
              author { login }
              authorAssociation
            }
          }
        }
      }

      reviews(first: 50) {
        nodes { state body submittedAt url author { login } }
      }

      comments(first: 100) {
        pageInfo { hasNextPage endCursor }
        nodes { body createdAt url author { login } }
      }
    }
  }
}'
```

### Paging

If `reviewThreads.pageInfo.hasNextPage` is true, re-run with an `$after` cursor:

```bash
gh api graphql \
  -F owner="$OWNER" -F repo="$REPO" -F number="$N" -F after="$END_CURSOR" \
  -f query='
query($owner:String!, $repo:String!, $number:Int!, $after:String!) {
  repository(owner:$owner, name:$repo) {
    pullRequest(number:$number) {
      reviewThreads(first: 100, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes { ... }
      }
    }
  }
}'
```

Same shape for `comments`. Page until `hasNextPage` is false — never stop early
and never report a partial set as complete.

### Fields that matter

| Field | Use |
|---|---|
| `isResolved` | half of the actionable test |
| `comments.totalCount` | the other half — `1` means nobody has replied |
| `comments.nodes[0].databaseId` | the id you reply to in §3 |
| `path`, `line` | where the comment points; `line` is `null` on outdated threads — fall back to `originalLine` |
| `isOutdated` | the code moved under the comment; still triage it, don't auto-drop |
| `author.login` | ends in `[bot]` for bot noise |

---

## 3. Reply to a review thread

Replies to the thread's **root** comment — the `databaseId` of
`comments.nodes[0]`, not the thread's GraphQL `id`.

```bash
gh api "repos/$OWNER/$REPO/pulls/$N/comments/$ROOT_DATABASE_ID/replies" \
  -f body='applied'
```

For items that came from a review summary or a conversation comment (no thread to
reply to), post one consolidated comment instead:

```bash
gh pr comment "$N" --repo "$OWNER/$REPO" --body 'applied: <short list>'
```

**Do not resolve threads.** The mutation exists
(`resolveReviewThread`) — it is deliberately not used here.

---

## 4. Push

```bash
git -C "$REPO" push
# only when the branch has no upstream:
git -C "$REPO" push -u origin "$BRANCH"
```

Never `--force`, never `--force-with-lease`, never `--no-verify`.
