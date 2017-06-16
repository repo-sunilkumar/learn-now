<%@ WebHandler Language="C#" Class="query" %>

using System;
using System.Web;
using System.Text;

using System.IO;
using System.IO.Compression;
using System.Net;
using System.Web.Script.Serialization;
using System.Linq;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Net.Cache;
public class query : IHttpHandler
    {
    string Action, Data1, Data2, Data3, Data4, Data5, Data6, Data7;
    StringBuilder sb = new StringBuilder();
    //string encode = "";

    HttpContext _context;
    Boolean DoEncode = true;
    public void ProcessRequest(HttpContext context)
        {
        _context = context;
        Action = QueryString(context, "Action");
        Data1 = QueryString(context, "Data1");
        Data2 = QueryString(context, "Data2");
        Data3 = QueryString(context, "Data3");
        Data4 = QueryString(context, "Data4");
        Data5 = QueryString(context, "Data5");
        Data6 = QueryString(context, "Data6");
        Data7 = QueryString(context, "Data7");


        try
            {
            switch (Action)
                {

                //Home
                case "home": GetTopicList(Cmn.ToInt(Data1)); break;

                case "getData": getData(); break;
                case "GetKeyword": GetKeyword(Cmn.ToInt(Data1), Data2); break;
                case "GetQuestions": GetQuestions(Data1, Cmn.ToInt(Data2), Cmn.ToInt(Data3)); break;
                case "GetAllQuestions": GetAllQuestions(Cmn.ToInt(Data1)); break;
                case "SaveQuestion": SaveQuestion(); break;

                case "GetSelectedQuestion": GetSelectedQuestion(Cmn.ToInt(Data1), Cmn.ToInt(Data2)); break;
                case "File": ReturnFileText(context, Data1); break;

                case "SM": SendMail(); break;
                case "Search":
                SearchQues(Data1.ToUpper());
                break;

                //Utilities
                case "GetPNRStatus": GetPNRStatus(Data1); break;
                case "TraceUtil": TraceUtil(Data1, Data2); break;

                //Mobile
                case "topics": GetTopics(); break;
                case "child": GetChild(Cmn.ToInt(Data1)); break;

                //case "SearchQuestion": SearchQuestion(term); break;

                }
            }
        catch (Exception ex)
            {
            sb.Append(ex.Message);
            }
        finally
            {
            //od : other domain, response should not be compressed when called from other  websites
            if (Data7 == "od") DoEncode = false;

            if (DoEncode)
                context.Response.BinaryWrite(Cmn.GetCompressed(sb.ToString(), GetEncode(context)));
            else
                context.Response.Write(sb.ToString());
            }

        }


    #region New Code
    void GetTopicList(int parentID)
        {
        string res = Global.GetFromCache("topicsList", _context);
        res = "";
        if (res != "")
            {
            sb.Append(res);
            return;
            }

        List<Topic> topicList = Global.TopicList.ToList();

        var newlist = topicList.Select(a => new
            {
            id = a.ID,
            url = a.URL,
            image = Global.GetTopicImage(a.ID),
            name = a.Name,
            quescount = Global.SubjectiveList.Values.Where(m => m.Language == a.ID).ToList().Count()
            }).ToList();

        res = new JavaScriptSerializer().Serialize(newlist);
        sb.Append(res);
        Global.SaveInCache("topicsList", res, _context);
        }



    #endregion
    void GetKeyword(int LanguageID, string query)
        {
        if (Keyword.KeywordListCache.Count == 0)
            new Keyword().LoadKeywords();

        query = query.ToUpper();

        Dictionary<string, string> rslt = new Dictionary<string, string>();

        List<Keyword> keylist = Keyword.KeywordListCache.Where(m => m.LanguageID == LanguageID).ToList();

        List<Keyword> kl = keylist.Where(m => m.Name.ToUpper().StartsWith(query)).ToList();
        foreach (Keyword k in kl)
            {
            rslt.Add(k.ID.ToString(), k.Name);
            keylist.Remove(k);
            }

        if (rslt.Count < 5)
            {
            kl = keylist.Where(m => m.Name.ToUpper().Contains(query)).Take(10).ToList();
            foreach (Keyword k in kl)
                rslt.Add(k.ID.ToString(), k.Name);
            }
        sb.Append(new JavaScriptSerializer().Serialize(rslt));
        }
    void GetTopics()
        {
        string res = Global.GetFromCache("topics", _context);
        res = "";

        if (res != "")
            {
            sb.Append(res);
            return;
            }


        List<Topic> prnts = Global.TopicList.ToList();
        var newlist = prnts.Select(a => new
            {
            id = a.ID,
            name = a.Name
            }).ToList();

        res = new JavaScriptSerializer().Serialize(newlist);
        sb.Append(res);
        Global.SaveInCache("topics", res, _context);
        }


    void GetChild(int ParentID)
        {
        List<Topic> childs = Global.ParentChildList[ParentID];
        var newlist = childs.Select(a => new
            {
            id = a.ID,
            name = a.Name
            }).ToList();

        sb.Append(new JavaScriptSerializer().Serialize(newlist));
        }

    public class Search
        {
        public string q = "";
        public int id;
        public int l;
        public string p = "";

        }

    void SearchQues(string term)
        {
        List<Search> searchlist = new List<Search>();

        List<QuesList> qlist = Global.SubjectiveList.Values.Where(m => m.Question.ToUpper().Contains(term)).Take(10).ToList();
        foreach (QuesList q in qlist)
            searchlist.Add(new Search() { q = q.Question, id = q.ID, l = (int)q.Language });

        List<MultipleChoice> mclist = Global.MultipleChoiceList.Values.Where(m => m.Question.ToUpper().Contains(term)).Take(10).ToList();
        foreach (MultipleChoice q in mclist)
            searchlist.Add(new Search() { q = q.Question, id = q.ID, l = (int)q.Language });

        if (searchlist.Count == 0)
            {
            string[] f = term.Split(' ');
            foreach (string s in f)
                {
                if (s == "" || s == "A" || s == "OF" || s == "AND" || s == "IN")
                    continue;

                qlist = Global.SubjectiveList.Values.Where(m => m.Question.ToUpper().Contains(s)).Take(10).ToList();
                foreach (QuesList q in qlist)
                    searchlist.Add(new Search() { q = q.Question, id = q.ID, l = (int)q.Language });

                mclist = Global.MultipleChoiceList.Values.Where(m => m.Question.ToUpper().Contains(s)).Take(10).ToList();
                foreach (MultipleChoice q in mclist)
                    searchlist.Add(new Search() { q = q.Question, id = q.ID, l = (int)q.Language });
                }
            }
        sb.Append(new JavaScriptSerializer().Serialize(searchlist));
        DoEncode = false;
        }

    void GetSelectedQuestion(int QID, int langid)
        {
        Topic tp = Global.GetTopicByID(langid);

        //if (true)
        //    {
        //    QuesList ques = Global.SubjectiveList[QID];
        //    var nlist = new
        //        {
        //        id = ques.ID,
        //        q = ques.Question,
        //        a = ques.AnswerString,
        //        l = ques.Language,
        //        n = tp.Name,
        //        t = 0
        //        };
        //    sb.Append(ques == null ? "{}" : new JavaScriptSerializer().Serialize(nlist));
        //    }
        //else
        //    {
        //    MultipleChoice ques = Global.MultipleChoiceList[QID];
        //    var nlist = new
        //        {
        //        id = ques.ID,
        //        q = ques.Question,
        //        a = ques.AnswerString,
        //        l = ques.Language,
        //        n = tp.Name,
        //        op1 = ques.Option1,
        //        op2 = ques.Option2,
        //        op3 = ques.Option3,
        //        op4 = ques.Option4,
        //        op5 = ques.Option5,
        //        t = 1
        //        };
        //    sb.Append(ques == null ? "{}" : new JavaScriptSerializer().Serialize(nlist));
        //    }
        }

    void SaveQuestion()
        {
        string t =  HttpContext.Current.Request.Form["name"];
        }

    void GetAllQuestions(int TopicId)
        {
        Topic tp = Global.GetTopicByID(TopicId);
        if (tp == null)
            {
            sb.Append("[]");
            return;
            }

        StringBuilder str = new StringBuilder("");

        List<QuesList> QList = Global.SubjectiveList.Values.Where(m => m.Language == tp.ID).ToList();

        var newlist = QList.Select(a => new
            {
            id = a.ID,
            q = a.Question,
            a = a.AnswerString,
            }).ToList();

        var resp = new { ques = newlist };
        sb.Append(new JavaScriptSerializer().Serialize(resp));
        }


    void GetQuestions(string TopicUrl, int PageNo, int quesType = 0)
        {
        Topic tp = Global.GetTopicByURL(TopicUrl);
        if (tp == null)
            {
            sb.Append("[]");
            return;
            }

        string cacheKey = TopicUrl + "_" + PageNo;
        string res = Global.GetFromCache(cacheKey, _context);

        res = "";

        if (res != "")
            {
            sb.Append(res);
            return;
            }

        int recordsToSkip = PageNo == 1 ? 0 : ((PageNo - 1) * Global.RecordsPerPage);

        StringBuilder str = new StringBuilder("");
        if (quesType == 0)
            {

            List<QuesList> QList = Global.SubjectiveList.Values.Where(m => m.Language == tp.ID).ToList();
            List<QuesList> QListToSend = QList.Skip(recordsToSkip).Take(Global.RecordsPerPage).ToList();

            var newlist = QListToSend.Select(a => new
                {
                t = 0,
                id = a.ID,
                q = a.Question,
                a = a.AnswerString,
                l = a.Language,
                u = a.URL
                }).ToList();

            var resp = new { total = QList.Count, currentpage = PageNo, perpage = Global.RecordsPerPage, ques = newlist };

            res = new JavaScriptSerializer().Serialize(resp);
            sb.Append(res);
            Global.SaveInCache(cacheKey, res, _context);
            }
        else
            {

            List<MultipleChoice> QList = Global.MultipleChoiceList.Values.Where(m => m.Language == tp.ID).ToList();
            List<MultipleChoice> QListToSend = QList.Skip(recordsToSkip).Take(Global.RecordsPerPage).ToList();

            var newlist = QListToSend.Select(a => new
                {
                t = 1,
                id = a.ID,
                q = a.Question,
                op1 = a.Option1,
                op2 = a.Option2,
                op3 = a.Option3,
                op4 = a.Option4 == null ? "" : a.Option4,
                op5 = a.Option5 == null ? "" : a.Option5,
                a = a.AnswerString,
                l = a.Language,
                u = a.URL
                }).ToList();


            var resp = new { total = QList.Count, currentpage = PageNo, perpage = Global.RecordsPerPage, ques = newlist };

            res = new JavaScriptSerializer().Serialize(resp);
            sb.Append(res);
            Global.SaveInCache(cacheKey, res, _context);
            }
        }

    void ReturnFileText(HttpContext context, string filename)
        {
        string txt = System.IO.File.ReadAllText(context.Server.MapPath(@"~/" + filename));
        if (filename.Contains(".css"))
            context.Response.ContentType = "text/css";

        if (filename.Contains(".js"))
            context.Response.ContentType = "application/javascript";

        sb.Append(txt);

        }


    public string GetEncode(HttpContext context)
        {
        string encodings = context.Request.Headers.Get("Accept-Encoding");
        string encode = "no";

        if (encodings != null)
            {
            encodings = encodings.ToLower();
            if (encodings.Contains("gzip"))
                {
                context.Response.AppendHeader("Content-Encoding", "gzip");
                encode = "gzip";
                }
            else if (encodings.Contains("deflate"))
                {
                context.Response.AppendHeader("Content-Encoding", "deflate");
                encode = "deflate";
                }
            }
        return encode;
        }

    void SearchQuestion(string args)
        {
        //var newlist = Global.QuestionsList.Values.Where(m => m.Question.ToUpper().Contains(args.ToUpper())).ToList().Select(a => new
        //{
        //    ID = a.ID,
        //    Question = a.Question
        //}).Take(10);
        //sb.Append(new JavaScriptSerializer().Serialize(newlist));
        }
    void SendMail1()
        {
        //String Data = Data2;
        //string[] F = Data.Split('^');
        //StringBuilder QStr = new StringBuilder("");
        //for (int i = 0; i < F.Length; i++)
        //{
        //    if (string.IsNullOrWhiteSpace(F[i]))
        //        continue;

        //    Questions Q = Global.QuestionsList.Values.FirstOrDefault(m => m.ID == Cmn.ToInt(F[i]));
        //    if (Q != null)
        //        QStr.Append("<div style='padding: 5px;border: 1px solid #e5e5e5;background-color: #485181;color: #F7FDFF;'><b>Question :</b> " + Q.Question + "</div>" +
        //                    "<div style='padding: 5px;border: 1px solid #e5e5e5;background-color: #DBDCE0;color: #060A0C;'><b>Answer : </b><br /><br />" + _context.Server.HtmlDecode(Q.Answer) + "<br /><br /></div>");
        //}
        //QStr.Append("<div style='padding: 5px; border: 1px solid #e5e5e5; background-color: #D3C631; color: #4B071D;'><b>Send Via Learning Zone &copy; Sunil Kumar</b></div>");
        //try
        //{
        //    email.SendEmail("Question Answer From Study Point", Data1, QStr.ToString());
        //}
        //catch (Exception ex)
        //{
        //    sb.Append("Error While Sending Mail. Please try again.");
        //}
        }

    void SendMail()
        {
        //NameValueCollection nvc = _context.Request.Form;
        //String Data = nvc["Data"];
        //string[] F = Data.Split('^');
        //StringBuilder QStr = new StringBuilder("");
        //for (int i = 0; i < F.Length; i++)
        //{
        //    if (string.IsNullOrWhiteSpace(F[i]))
        //        continue;

        //    string[] d = F[i].Split('-');

        //    if (d[1] == "0")
        //    {
        //        Questions Q = Global.QuestionsList.Values.FirstOrDefault(m => m.ID == Cmn.ToInt(d[0]));
        //        if (Q != null)
        //            QStr.Append("<div style='padding: 5px;border: 1px solid #e5e5e5;background-color: #485181;color: #F7FDFF;'><b>Question :</b> " + Q.Question + "</div>" +
        //                        "<div style='padding: 5px;border: 1px solid #e5e5e5;background-color: #DBDCE0;color: #060A0C;'><b>Answer : </b><br /><br />" + _context.Server.HtmlDecode(Q.Answer) + "<br /><br /></div>");
        //    }
        //    else
        //    {
        //        ObjectiveQuestions Q = Global.ObjectiveQuestionsList.Values.FirstOrDefault(m => m.ID == Cmn.ToInt(d[0]));
        //        if (Q != null)
        //        {
        //            QStr.Append("<div style='padding: 5px;border: 1px solid #e5e5e5;background-color: #485181;color: #F7FDFF;'><b>Question :</b> " + Q.Question + "</div>");
        //            string[] opt = Q.Options.Split('^');
        //            QStr.Append("<div style='padding: 5px;border: 1px solid #e5e5e5;background-color: #DBDCE0;color: #060A0C;'><ul style='margin-left: 15px; list-style: none; list-style-type: lower-alpha; '>");
        //            for (int j = 0; j < opt.Length; j++)
        //                if (!string.IsNullOrWhiteSpace(opt[j]))
        //                    QStr.Append("<li>" + opt[j] + "</li>");

        //            QStr.Append("</ul>");
        //            QStr.Append("<b>Answer : " + Q.Answer + " - <span style='color:Green; font-weight:bold'>" + opt[(int)Q.Answer[0] - 97] + "</span></b></div>");
        //        }
        //    }
        //}
        //QStr.Append("<div style='padding: 5px; border: 1px solid #e5e5e5; background-color: #D3C631; color: #4B071D;'><b>Send Via Learning Zone &copy; Sunil Kumar</b></div>");
        //try
        //{
        //    sb.Append(email.SendEmail("Question Answer Learning Zone (infonexus.in)", nvc["To"], QStr.ToString()));
        //}
        //catch (Exception ex)
        //{
        //    sb.Append("Error While Sending Mail. Please try again.");
        //}
        }

    public void getData()
        {
        NameValueCollection nvc = _context.Request.Form;
        _context.Response.AppendHeader("Access-Control-Allow-Origin", "*");
        string Ret = Download(Convert.ToString(nvc["data"]), "", "");
        sb.Append(Ret);
        }

    public void TraceVehicle(string Mobile)
        {
        string Ret = Download("http://www.indiatrace.com/trace-mobile-number-location/trace-mobile-number-location.php?N=" + Mobile, "", "", "", "http://www.indiatrace.com/trace-mobile-number-location/trace-mobile-number.php", "www.indiatrace.com", "");
        sb.Append(Ret);
        }

    public void TraceUtil(string ReqType, string Val)
        {
        string URL = "", Referer = "", Host = "", PostData = "";
        switch (ReqType)
            {
            case "mobile":
            URL = "http://www.indiatrace.com/trace-mobile-number-location/trace-mobile-number-location.php?N=" + Val;
            Referer = "http://www.indiatrace.com/trace-mobile-number-location/trace-mobile-number.php";
            Host = "www.indiatrace.com";
            break;

            case "vehicle":
            URL = "http://www.indiatrace.com/trace-vehicle-location/trace-vehicle-location.php";
            Referer = "http://www.indiatrace.com/trace-vehicle-location/trace-vehicle-number.php";
            Host = "www.indiatrace.com";
            string[] f = Val.Split('-');
            PostData = "D1=" + f[0] + "&D2=" + f[1] + "&D3=" + f[2];
            break;
            }
        string Ret = Download(URL, PostData, "", "", Referer, Host, "");
        sb.Append(Ret);
        }

    public void GetPNRStatus(string PNR)
        {
        string PNRURL = "";
        if (File.Exists(_context.Server.MapPath(@"~/PNR_URL.txt")))
            PNRURL = File.ReadAllText(_context.Server.MapPath(@"~/PNR_URL.txt"));

        if (PNRURL == "") PNRURL = GetPostURLForPNR();

        string PostData = "lccp_pnrno1=" + PNR + "&lccp_cap_val=63736&lccp_capinp_val=63736";
        string Ret = Download(PNRURL, PostData, "", "", "http://www.indianrail.gov.in/pnr_Enq.html", "www.indianrail.gov.in", "http://www.indianrail.gov.in");

        if (string.IsNullOrWhiteSpace(Ret)) //if post url of pnr is changed
            {
            PNRURL = GetPostURLForPNR();
            Ret = Download(PNRURL, PostData, "", "", "http://www.indianrail.gov.in/pnr_Enq.html", "www.indianrail.gov.in", "http://www.indianrail.gov.in");
            }
        sb.Append(Ret);
        }

    string GetPostURLForPNR()
        {
        string posturlData = Download(@"http://www.indianrail.gov.in/pnr_Enq.html", "", "", "");
        string[] d = posturlData.Split('\n');
        //		<form id="form3" name="pnr_stat" method="post" action="http://www.indianrail.gov.in/cgi_bin/inet_pnstat_cgi_24335.cgi" onsubmit="return checkform(this);"> 
        string url = "";
        foreach (string s in d)
            {
            if (s.IndexOf("<form id=\"form3\"") > -1)
                url = s.Substring(s.IndexOf("action=") + 8, (s.IndexOf(".cgi") + 4) - s.IndexOf("action=") - 8);
            }
        File.WriteAllText(_context.Server.MapPath(@"~/PNR_URL.txt"), url);
        return url;
        }

    public string Download(string URL, string PostData, string FileToWrite, string Cookie = "", string Referrer = "", string Host = "", string Origin = "")
        {
        string Result = "";
        string Error = "";
        WebRequest objRequest = HttpWebRequest.Create(URL);
        objRequest.Method = "POST";
        objRequest.ContentType = "application/x-www-form-urlencoded";

        ((HttpWebRequest)objRequest).UserAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.95 Safari/537.36";

        if (Referrer != "") ((HttpWebRequest)objRequest).Referer = Referrer;
        if (Host != "") ((HttpWebRequest)objRequest).Host = Host;
        if (Origin != "") objRequest.Headers["Origin"] = Origin;

        objRequest.Timeout = 5000;

        if (Cookie != "")
            objRequest.Headers.Add("Cookie", Cookie);

        if (PostData.Length > 0)
            {
            ASCIIEncoding encoding = new ASCIIEncoding();
            byte[] data = data = encoding.GetBytes(PostData);
            objRequest.ContentLength = data.Length;

            Stream newStream = objRequest.GetRequestStream();
            newStream.Write(data, 0, data.Length);
            newStream.Close();
            }
        else
            {
            objRequest.Method = "GET";
            objRequest.ContentLength = 0;
            }

        try
            {
            using (HttpWebResponse response = (HttpWebResponse)objRequest.GetResponse())
                {
                if ((response.StatusCode == HttpStatusCode.OK))
                    {
                    using (StreamReader sr = new StreamReader(response.GetResponseStream()))
                        {
                        Result = sr.ReadToEnd();
                        //string Data = sr.ReadToEnd();
                        //File.WriteAllText(FileToWrite, Data);
                        }
                    }
                }
            }
        catch (Exception ex) { Error = ex.Message; }
        return Result;
        }


    WebClient GetHeaders(string SessionID = "")
        {
        WebClient wc = new WebClient(); //WebHeaderCollection whc = wc.Headers; 
        wc.Headers[HttpRequestHeader.Referer] = "http://enquiry.indianrail.gov.in/ntes/";
        wc.Headers[HttpRequestHeader.UserAgent] = "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.66 Safari/537.36";
        if (SessionID.Length > 0)
            wc.Headers[HttpRequestHeader.Cookie] = SessionID;
        return wc;
        }

    string QueryString(HttpContext context, string key)
        {
        return context.Request[key] != null ? context.Request[key] : "";
        }

    public bool IsReusable
        {
        get
            {
            return false;
            }
        }
    }