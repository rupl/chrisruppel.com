/**
 * Cookie for critical CSS
 *
 * @see https://github.com/11ty/demo-eleventy-edge/blob/main/netlify/edge-functions/repeat.js
 */
export default async (request, context) => {
  let url = new URL(request.url);

  // Link to ?critical-reset will delete the cookie
  if(url.searchParams.get("critical-reset") === "") {
    // Awkward part here is that delete needs to happen on /
    // (can’t happen on /critical-css/) due to cookie path on root
    context.cookies.delete("critical");

    return new Response(null, {
      status: 302,
      headers: {
        location: "/critical-css/",
      }
    });
  } else if(!context.cookies.get("criticalLoaded")) {
    // This new cookie value won’t be available until the next page request
    context.cookies.set({
      name: "criticalLoaded",
      value: 1,
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    });
  }

  return context.next();
};
