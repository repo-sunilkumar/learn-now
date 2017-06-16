using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.UI.WebControls;

public partial class Topic
    {
        public string Message = "";
       
        public int ID { get; set; }

        public string DisplayName { get; set; }

        public string Name { get; set; }
   
        public string URL { get; set; }

        public string TagLine { get; set; }

        public Topic()
        {

        }

        public static void FillLanguages(DropDownList ddLanguage)
        {
            ddLanguage.Items.Clear();
            List<Topic> tplist = Global.TopicList;
            foreach (Topic tp in tplist)
            {
                    ddLanguage.Items.Add(new ListItem(tp.DisplayName, tp.ID.ToString()));
            }
        }
    
        public static Topic GetTopicElement(IDataReader dr)
        {
            Topic tp = new Topic()
            {
                ID = Cmn.ToInt(Convert.ToString(dr["ID"])),
                DisplayName = Convert.ToString(dr["DisplayName"]),
                Name = Convert.ToString(dr["Name"]),
                TagLine = Convert.ToString(dr["TagLine"]),
                URL = Convert.ToString(dr["URL"])
            };
            return tp;
        }


        public static List<Topic> GetResult(string query)
        {
            List<Topic> obj = new List<Topic>();
            string error = string.Empty;
            Database db = new Database(Global.ConnectionStringDB);
            try
            {
                IDataReader dr = db.GetDataReader(query, ref error);
                while (dr.Read())
                {
                    obj.Add(GetTopicElement(dr));
                }
            }
            finally { db.Close(); }
            return obj;
        }

        public static List<Topic> GetData(int ParentID = 0)
        {
            if (ParentID == 0)
                return GetResult("Select * FROM Topic Order By ID");

            return GetResult("Select * FROM Topic Where ParentID=" + ParentID + " Order By ID");
        }

        public static Topic GetByID(int ID)
        {
            return GetResult("Select * FROM Topic WHERE ID= " + ID).FirstOrDefault();
        }

        public string Save()
        {
            //try
            //{
            //    using (NotesEntities context = new NotesEntities())
            //    {

            //        Topic tempObj = context.Topics.FirstOrDefault(m => m.ID == ID);
            //        Boolean IsNew = tempObj == null;

            //        if (IsNew)
            //        {
            //            ID = 1;
            //            try { ID = context.Topics.Max(m => m.ID) + 1; }
            //            catch { ID = 1; }
            //            context.Topics.Add(this);
            //        }

            //        else
            //        {
            //            //if (tempObj != null)
            //            //    context.CreateObjectSet<Topic>().Detach(tempObj);

            //            //context.CreateObjectSet<Topic>().Attach(this);
            //            //context.ObjectStateManager.ChangeObjectState(this, EntityState.Modified);
            //        }
            //        context.SaveChanges();
            //    }
            //}
            //catch (Exception ex)
            //{
            //    Cmn.LogError(ex, "Topic()");
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
                db.RunQuery("DELETE FROM Topic WHERE ID=" + id);
            }
            finally { db.Close(); }
        }

    }
