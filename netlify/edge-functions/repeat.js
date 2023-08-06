/**
 * Cookie for critical CSS
 *
 * @see https://github.com/11ty/demo-eleventy-edge/blob/main/netlify/edge-functions/repeat.js
 */
export default async (request, context) => {
  let url = new URL(request.url);
  let cookieName = 'criticalLoaded';

  // Link to ?critical-reset will delete the cookie
  if(url.searchParams.get("critical-reset") === "") {
    context.cookies.delete(cookieName);

    return new Response(null, {
      status: 302,
      headers: {
        location: "/",
      }
    });
  } else if(!context.cookies.get(cookieName)) {
    // This new cookie value won’t be available until the next page request
    context.cookies.set({
      name: cookieName,
      value: 1,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    });
  }

  return context.next();
};
