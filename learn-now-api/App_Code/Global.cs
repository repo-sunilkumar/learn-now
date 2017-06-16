using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Text.RegularExpressions;
using System.Linq;
using System.Web.Caching;

public enum QuestionType : int
    {
    Course = 1,
    Interview = 2,
    }

public enum QuestionStatus : int
    {
    PENDING = 1,
    ANSWERED = 2,
    CLOSED = 3
    }

public class Feedbacks
    {
    public string EmailID;
    public string Name;
    public string Feedback;
    public DateTime SubmitDate;
    }

public class CacheCls
    {
    public string data = "";
    public string metadesc = "";
    public string metakey = "";
    }

public class Global
    {
    public static string CurrentProject = "";
    public static int RecordsPerPage = 10;
    public static int RecordsPerPageForMobile = 5;
    public static string Error = "";
    public static string DatabaseName = "Notes.sdf";
    public static string MetaDes = "Find tutorials and interview question of .NET, ASP.NET, C#.Net, Database, JQuery, Google Map, Current Affairs, Geography, History.";
    public static string MetaKeys = "Tutorials and Interview question of .NET, ASP.NET, C#.Net, Database, JQuery, Google Map, Current Affairs, Geography, History.";

    public static List<Feedbacks> FeedbackList = new List<Feedbacks>();

   
   
    //Left Bar navigations string displayed when displaying questiosn of any category
    public static Dictionary<int, string> LeftBarString = new Dictionary<int, string>();
    //Topic list for main page
    public static string _DefaultTopicList = "";

    public static string GetTopicImage(int ID)
        {
        return "/images/topics/topic_" + ID + ".jpg";
        }


    public static string GenerateSlug(string phrase)
        {
        string str = RemoveAccent(phrase).Replace("&", "and").ToLower();

        str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
        str = Regex.Replace(str, @"\s+", "-").Trim();
        str = Regex.Replace(str, @"\-+", "-").Trim();

        return str;
        }

    public static Dictionary<int, List<Topic>> ParentChildList = new Dictionary<int, List<Topic>>();

    public static string GetErrorMessage(string msg)
        {
        return "<span class='text-danger'>" + msg + "</span>";
        }

    public static string GetSuccessMessage(string msg)
        {
        return "<span class='text-success'>" + msg + "</span>";
        }

    public static void CheckLogin(string PrevPage = "")
        {

        if (Global.AdminLogin == 0)
            {
            Global.PrevPage = PrevPage;
            HttpContext.Current.Response.Redirect(@"~/edit/login.aspx");
            }
        }
    public static string RemoveAccent(string txt)
        {
        byte[] bytes = System.Text.Encoding.GetEncoding("Cyrillic").GetBytes(txt);
        return System.Text.Encoding.ASCII.GetString(bytes);
        }

    public static Dictionary<int, MultipleChoice> MultipleChoiceList = new Dictionary<int, MultipleChoice>();
    public static Dictionary<int, QuesList> SubjectiveList = new Dictionary<int, QuesList>();
    public static List<Topic> TopicList = new List<Topic>();
    public static List<Article> ArticleList = new List<Article>();

    public static Topic GetTopicByURL(string topicurl)
        {
        return Global.TopicList.FirstOrDefault(m => m.URL == topicurl);
        }

    public static Topic GetTopicByID(int topicid)
        {
        return Global.TopicList.FirstOrDefault(m => m.ID == topicid);
        }

    public static void LoadArticle()
        {
        ArticleList.Clear();
        List<Article> ArtList = Article.GetData();
        foreach (Article art in ArtList)
            {
            art.URL = Global.GenerateSlug(art.Subject);
            ArticleList.Add(art);
            }
        }
    public static void LoadTopics()
        {
        TopicList = Topic.GetData();
        }

    public static bool ContainsUnicodeChars(string text)
        {
        return !string.IsNullOrEmpty(text);
        }

    public static string GetUniqueURL(int ParentID, string TopicName)
        {
        if (ParentID != 0)
            {
            Topic pr = Global.TopicList.FirstOrDefault(m => m.ID == ParentID);
            if (pr != null)
                return GenerateSlug(pr.Name + " " + TopicName);

            }
        return GenerateSlug(TopicName);
        }
    public static void LoadMultipleChoiceQuestions()
        {
        MultipleChoiceList.Clear();

        if (TopicList.Count == 0)
            LoadTopics();

        List<MultipleChoice> mclist = MultipleChoice.GetData();
        List<Topic> tps = TopicList.ToList();
        string str = "";
        foreach (Topic tp in tps)
            {
            List<MultipleChoice> mclist1 = mclist.Where(m => m.Language == tp.ID).ToList();
            foreach (MultipleChoice mc in mclist)
                {
                str = Global.GenerateSlug(mc.Question);

                mc.URL = str.Length < 250 ? str : str.Substring(0, 250);

                string ans = "";
                switch (mc.Answer)
                    {
                    case 1: ans = mc.Option1; break;
                    case 2: ans = mc.Option2; break;
                    case 3: ans = mc.Option3; break;
                    case 4: ans = mc.Option4; break;
                    case 5: ans = mc.Option5; break;
                    }
                mc.AnswerString = ans;

                if (!MultipleChoiceList.ContainsKey(mc.ID))
                    MultipleChoiceList.Add(mc.ID, mc);
                }
            }


        SubjectiveList.Clear();
        List<QuesList> qList = QuesList.GetData();

        foreach (Topic tp in tps)
            {
            List<QuesList> qtemp = qList.Where(m => m.Language == tp.ID).ToList();

            List<QuesList> ql = new List<QuesList>();
            foreach (QuesList qq in qtemp)
                {
                qq.AnswerString = Cmn.GetUnCompressed(qq.Answer, (int)qq.AnswerLength).Replace("?", "'");
                qq.URL = Global.GenerateSlug(qq.Question);
                SubjectiveList.Add(qq.ID, qq);
                }
            }
        }

    public Global()
        {

        }

    public static int? GetValueOf<T>(string EnumConst) where T : struct
        {
        int? result = null;
        T temp = default(T);
        if (Enum.TryParse<T>(EnumConst, out temp))
            {
            result = Convert.ToInt32(temp);
            }
        return result;
        }

    public static void SaveInCacheWithMetaInfo(string key, string data, string metades, string metakey, HttpContext _context = null)
        {
        if (_context == null)
            _context = HttpContext.Current;

        _context.Cache[key] = new CacheCls() { data = data, metadesc = metades, metakey = metakey };
        }
    public static CacheCls GetFromCacheWithMetaInfo(string key, HttpContext _context = null)
        {
        if (_context == null)
            _context = HttpContext.Current;

        if (_context.Cache.Get(key) != null)
            return (CacheCls)_context.Cache[key];
        else
            return null;
        }

    public static void SaveInCache(string key, string data, HttpContext _context = null)
        {
        if (_context == null)
            _context = HttpContext.Current;

        _context.Cache[key] = data;
        }
    public static string GetFromCache(string key)
        {
        return "";
        }
    public static void ClearCache()
        {
        System.Collections.IDictionaryEnumerator idic = HttpContext.Current.Cache.GetEnumerator();
        while (idic.MoveNext())
            {
            HttpContext.Current.Cache.Remove(idic.Key.ToString());
            }
        }

    public static void LoadGlobalData()
        {

        Cmn.LogError(null, "Data Loaded");

        ClearCache();
        _DefaultTopicList = "";
        LeftBarString.Clear();
        LoadTopics();
        //LoadParentChildList();
        LoadMultipleChoiceQuestions();
        //LoadFeedback();
        //LoadArticle();
        }

    public static string Culture
        {
        get
            {
            if (HttpContext.Current.Session["Culture"] == null)
                return "en-US";
            else
                return HttpContext.Current.Session["Culture"].ToString();
            }

        set
            {
            HttpContext.Current.Session["Culture"] = value;
            }
        }
    public static string GetRootPathVirtual
        {
        get
            {
            string host = (HttpContext.Current.Request.Url.IsDefaultPort) ?
            HttpContext.Current.Request.Url.Host :
            HttpContext.Current.Request.Url.Authority;
            host = String.Format("{0}://{1}", HttpContext.Current.Request.Url.Scheme, host);
            if (HttpContext.Current.Request.ApplicationPath == "/")
                return host + "/";
            else
                return host + HttpContext.Current.Request.ApplicationPath + "/";

            }
        }
    public static string SelectedLanguage
        {
        get
            {
            if (HttpContext.Current.Session["SELECTEDLANGUAGE"] == null)
                return "1";
            else
                return HttpContext.Current.Session["SELECTEDLANGUAGE"].ToString();
            }

        set
            {
            HttpContext.Current.Session["SELECTEDLANGUAGE"] = value;
            }
        }

    public static string PrevPage
        {
        get
            {
            if (HttpContext.Current.Session["PREVPAGE"] == null)
                return "";
            else
                return HttpContext.Current.Session["PREVPAGE"].ToString();
            }

        set
            {
            HttpContext.Current.Session["PREVPAGE"] = value;
            }
        }

    public static int AdminLogin
        {
        get
            {
            if (HttpContext.Current.Session["ADMINLOGIN"] == null)
                return 0;
            else
                return Cmn.ToInt(HttpContext.Current.Session["ADMINLOGIN"].ToString());
            }

        set
            {
            HttpContext.Current.Session["ADMINLOGIN"] = value;
            }
        }

    //Used in HTML Editor
    public static string LastTmpFile
        {
        get
            {
            if (HttpContext.Current.Session["LastTmpFile"] == null)
                return "";
            else
                return HttpContext.Current.Session["LastTmpFile"].ToString();
            }

        set
            {
            HttpContext.Current.Session["LastTmpFile"] = value;
            }
        }


    public static string ConnectionStringDB
        {
        get
            {
            return @"Server=MST-SUNIL\SQLEXPRESS; Database=Notes;Trusted_Connection=True;";
            //return @"server=mssqle.infonexus.in;Database=infonexu_mydb;Uid=infonexu_sunil;Password=newt3809818234200@284";
            //return @"data source=mssqle.infonexus.in;initial catalog=infonexu_mydb;Uid=infonexu_sunil;Password=newt3809818234200@284";
            //return @"Server=mssqle.infonexus.in; Database=infonexu_mydb; Uid=infonexu_sunil;Password=newt3809818234200@284";
            }
        }
    public static string ConnectionStringEntity
        {
        get
            {
            //return @"metadata=res://*/App_Code.NotesModel.csdl|res://*/App_Code.NotesModel.ssdl|res://*/App_Code.NotesModel.msl;provider=System.Data.SqlClient;provider connection string=""data source=mssqle.infonexus.in;initial catalog=infonexu_mydb;persist security info=True;user id=infonexu_sunil;password=newt3809818234200@284;MultipleActiveResultSets=True;App=EntityFramework""";
            return @"metadata=res://*/App_Code.NotesModel.csdl|res://*/App_Code.NotesModel.ssdl|res://*/App_Code.NotesModel.msl;provider=System.Data.SqlClient;provider connection string=""data source=.\SQLEXPRESS;initial catalog=notes;persist security info=True;user id=ICPL\sunil.kumar3;MultipleActiveResultSets=True;App=EntityFramework""";
            }
        }
    public static string ConnectionStringTutorialDB
        {
        get
            {
            return @"data source=mssqle.infonexus.in;initial catalog=infonexu_mydb;integrated security=True;multipleactiveresultsets=True;Uid=infonexu_sunil;Password=newt3809818234200@284";
            }
        }
    public static string ConnectionStringTutorialDBEntity
        {
        get
            {
            return @"metadata=res://*/App_Code.TutorialModel.csdl|res://*/App_Code.TutorialModel.ssdl|res://*/App_Code.TutorialModel.msl;provider=System.Data.SqlServerCe.4.0;provider connection string=""data source=|DataDirectory|\TutorialDB.sdf""";
            }
        }

    }

