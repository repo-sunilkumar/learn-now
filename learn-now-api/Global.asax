<%@ Application Language="C#" %>
<%@ Import Namespace="System.Web.Routing" %>

<script RunAt="server">
    void Application_Start(object sender, EventArgs e)
        {
        InitializeRoutes(RouteTable.Routes);
        Global.LoadGlobalData();
        }

    private void InitializeRoutes(RouteCollection routes)
        {
        routes.MapPageRoute(routeName: "landingpage", routeUrl: "{Data1}", physicalFile: "~/index.html", checkPhysicalUrlAccess: true, defaults: new RouteValueDictionary() { { "Data1", "" } });
        }

    void Application_End(object sender, EventArgs e)
        {
        //  Code that runs on application shutdown
        Cmn.LogError(null, e.ToString());
        }

    void Application_Error(object sender, EventArgs e)
        {
        // Code that runs when an unhandled error occurs
        Cmn.LogError(null, e.ToString());
        }

    void Session_Start(object sender, EventArgs e)
        {
        // Code that runs when a new session is started

        }

    void Session_End(object sender, EventArgs e)
        {
        // Code that runs when a session ends. 
        // Note: The Session_End event is raised only when the sessionstate mode
        // is set to InProc in the Web.config file. If session mode is set to StateServer 
        // or SQLServer, the event is not raised.

        }
</script>
