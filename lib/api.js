async function fetchAPI(query, { variables } = {}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBINY_API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.WEBINY_PREVIEW_SECRET}`
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }

  return json.data
}

export async function getPreviewPostBySlug(slug) {
  const data = await fetchAPI(
    `
  query PostBySlug($where: JSON) {
    listPosts(where: $where) {
      data {
        slug
      }
    }
  }
  `,
    {
      variables: {
        where: {
          slug,
        },
      },
    }
  )
  return data.listPosts.data
}

export async function getAllPostsWithSlug() {
  const data = await fetchAPI(`
    query PostSlugs {
      listPosts {
        data {
          slug
        }
      }
    }
  `)
  return data?.listPosts.data
}

export async function getAllPostsForHome(preview) {
  const data = await fetchAPI(
    `
    query Posts {
      listPosts {
        data {
          id
          title
          slug
          description
          createdOn
          featuredImage
          author {
            name
            slug
            picture
          }
        }
      }
    }
  `,
    {
      variables: {
        where: {
          ...(preview ? {} : { status: 'published' }),
        },
      },
    }
  )
  return data.listPosts.data
}

export async function getPostBySlug(slug) {
  const data = await fetchAPI(
    `
      query PostBySlug( $PostsGetWhereInput: PostsGetWhereInput!) {
        getPosts( where: $PostsGetWhereInput ) {
          data {
            id
            slug
          }
        }
      }
    `,
      {
        variables: {
          PostsGetWhereInput:{
            slug: "preview-mode-static-generation"
          }
        }
      }
  )
  return data.getPosts.data
}

// export async function getPostAndMorePosts(slug, preview) {
//   const data = await fetchAPI(
//     `
//   query PostBySlug($where: JSON, $where_ne: JSON) {
//     posts(where: $where) {
//       title
//       slug
//       content
//       date
//       ogImage: coverImage{
//         url
//       }
//       coverImage {
//         url
//       }
//       author {
//         name
//         picture {
//           url
//         }
//       }
//     }

//     morePosts: posts(sort: "date:desc", limit: 2, where: $where_ne) {
//       title
//       slug
//       excerpt
//       date
//       coverImage {
//         url
//       }
//       author {
//         name
//         picture {
//           url
//         }
//       }
//     }
//   }
//   `,
//     {
//       preview,
//       variables: {
//         where: {
//           slug,
//           ...(preview ? {} : { status: 'published' }),
//         },
//         where_ne: {
//           ...(preview ? {} : { status: 'published' }),
//           slug_ne: slug,
//         },
//       },
//     }
//   )
//   return data
// }
