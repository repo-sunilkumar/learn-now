using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Web;
using System.IO;

    public partial class Article
    {
        public string Message = "";
        public string URL = "";

        public Article()
        {
            
        }

        public static string GetFolderName
        {
            get
            {
                string Folder = HttpContext.Current.Server.MapPath(@"~/learningzone/data/articles/");
                if (!Directory.Exists(Folder))
                    Directory.CreateDirectory(Folder);

                return Folder;
            }
        }
        

        public static List<Article> GetData()
        {
            //using (NotesEntities context = new NotesEntities())
            //{
            //    return context.Articles.OrderByDescending(m => m.PostDate).ToList();
            //}
            return null;

        }

        public static Article GetByID(int ID)
        {
            //using (NotesEntities context = new NotesEntities())
            //{
            //    return context.Articles.FirstOrDefault(m => m.ID == ID);
            //}
            return null;
        }

        public static List<Article> GetByTopic(int parentID)
        {
            //using (NotesEntities context = new NotesEntities())
            //{
            //    return context.Articles.Where(m => m.ParentID == parentID).ToList();
            //}
            return null;
        }

        public string Save()
        {
            //try
            //{
            //    using (NotesEntities context = new NotesEntities())
            //    {

            //        Article tempObj = context.Articles.FirstOrDefault(m => m.ID == ID);
            //        Boolean IsNew = tempObj == null;

            //        if (IsNew)
            //        {
            //            ID = 1;
            //            try { ID = context.Articles.Max(m => m.ID) + 1; }
            //            catch { ID = 1; }
            //            context.Articles.Add(this);
            //        }

            //        else
            //        {
            //            //if (tempObj != null)
            //            //    context.CreateObjectSet<Article>().Detach(tempObj);

            //            //context.CreateObjectSet<Article>().Attach(this);
            //            //context.ObjectStateManager.ChangeObjectState(this, EntityState.Modified);
            //        }
            //        context.SaveChanges();
            //    }
            //}
            //catch (Exception ex)
            //{
            //    Message += ex.Message;
            //}
            //return Message;
            return null;
        }


        public static void Delete(int id)
        {
            Database db = new Database(Global.ConnectionStringDB);
            try
            {
                db.RunQuery("DELETE FROM Article WHERE ID=" + id);
            }
            finally { db.Close(); }
        }

        public string Subject { get; set; }

        public int ID { get; set; }

        public int ParentID { get; set; }

        public DateTime PostDate { get; set; }

        public string Tags { get; set; }

        public int Owner { get; set; }
    }
