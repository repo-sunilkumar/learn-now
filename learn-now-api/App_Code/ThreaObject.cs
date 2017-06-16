using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;


    public class ThreadObject
    {
        public long Index;
        public Thread thread;
        public bool HasStarted;
        public HttpWebRequest myRequest;
        public int TimeOut;
        public int Tries;
        public Boolean Success;
        public string Error = "OK";
        public string FileRoot;
        public string FileWeb;
        //public string FileTxt;
        public string QMessage = "";
        public Boolean TdTextWithTitle = false;
        public string RequestURL = "";
        public string Referer = "";
        public string PostData = "";
		public string Host = "";
        public string[] HtmlDataTables;
        public string[] ResponsesInvalid;
        public string[] ResponsesValid;
        public string Method = "POST";
        public string DataDownloaded = "";
        public string DataProcessed = "";
        public int Counter;

        public Boolean SendResultToQ = true;

        public ThreadObject()
        {
            myRequest = null;
            thread = null;
            HasStarted = false;
            Success = false;
            HtmlDataTables = null;
            TimeOut = 15000;
        }

        public void Reset()
        {
            Success = false;
            HasStarted = true;
            Error = "OK";
            Counter = 0;
        }

        public void BuildRequest()
        {

            //if(myRequest==null)
                myRequest = (HttpWebRequest)WebRequest.Create(RequestURL);
            myRequest.ServicePoint.ConnectionLimit = 50;

            ASCIIEncoding encoding = new ASCIIEncoding();
			
			if(Host!="")
				myRequest.Host = Host;

            myRequest.Method = Method;
            myRequest.ContentType = "application/x-www-form-urlencoded";
            myRequest.Referer = Referer;
            myRequest.UserAgent = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022; InfoPath.2)";
            myRequest.Timeout = TimeOut;
            //myRequest.KeepAlive = false;

            if (PostData.Length > 0)
            {
                byte[] data = data = encoding.GetBytes(PostData);
                myRequest.ContentLength = data.Length;
                Stream newStream = myRequest.GetRequestStream();
                newStream.Write(data, 0, data.Length);
                newStream.Close();
            }
            else
                myRequest.ContentLength = 0;


        }

        public void ProcessDataDownloaded()
        {
            Success = true;
            Error = "OK";

            if (ResponsesInvalid != null)
            {
                foreach (string strError in ResponsesInvalid)
                {
                    if (DataDownloaded.Contains(strError))
                    {
                        Error = strError;
                        break;
                    }
                }
            }

            if (ResponsesValid != null && Error == "OK")
            {
                foreach (string strError in ResponsesValid)
                {
                    if (!DataDownloaded.Contains(strError))
                    {
                        Error = "Page not valid - Not found -" + strError;
                        break;
                    }
                }
            }
        }
    }

