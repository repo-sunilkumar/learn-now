using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
public class QuesList
    {
        public string Message = "";
        public string AnswerString = "";
        public string URL = "";

        public int Language { get; set; }

        public int AnswerLength { get; set; }

        public byte[] Answer { get; set; }

        public string Question { get; set; }

        public int ID { get; set; }

        public int Reviewed { get; set; }

        public string Tags { get; set; }

        public int Type { get; set; }
        
        public QuesList()
        {

        }

    public static QuesList GetQuestionElement(IDataReader dr)
        {
        QuesList tp = new QuesList();

        tp.ID = Cmn.ToInt(Convert.ToString(dr["ID"]));
        tp.Answer = (byte[])dr["Answer"]; //Encoding.ASCII.GetBytes(Convert.ToString(dr["Answer"]));
        tp.AnswerLength = Cmn.ToInt(Convert.ToString(dr["AnswerLength"]));
        tp.Language = Cmn.ToInt(Convert.ToString(dr["Language"]));
        tp.Question = Convert.ToString(dr["Question"]);
        tp.Reviewed = Cmn.ToInt(Convert.ToString(dr["Reviewed"]));
        tp.Tags = Convert.ToString(dr["Tags"]);
        tp.Type = Cmn.ToInt(Convert.ToString(dr["Type"]));
        return tp;
        }


        public static List<QuesList> GetResult(string query)
        {
            List<QuesList> obj = new List<QuesList>();
            string error = string.Empty;
            Database db = new Database(Global.ConnectionStringDB);
            try
            {
                IDataReader dr = db.GetDataReader(query, ref error);
                while (dr.Read())
                {
                    obj.Add(GetQuestionElement(dr));
                }
            }
            finally { db.Close(); }
            return obj;
        }

        public static List<QuesList> GetData()
        {
            return GetResult("Select * FROM QuesList Order By Language");
        }


        public static List<QuesList> GetByLanguage(int LangID)
        {
            return GetResult("Select * FROM QuesList Where Language = " + LangID);
        }

        
        public static QuesList GetByQuestion(int LangID, string Question)
        {
            return GetResult("Select * FROM QuesList Where Language = " + LangID + " AND Question = '" + Question + "'").FirstOrDefault();
        }

        public static QuesList GetByID(int ID)
        {
            return GetResult("Select * FROM QuesList Where ID = " + ID).FirstOrDefault();
        }

        public string Save()
        {
            //try
            //{
            //    using (NotesEntities context = new NotesEntities())
            //    {

            //        QuesList tempQuesList = context.QuesLists.FirstOrDefault(m => m.ID == ID);
            //        Boolean IsNew = tempQuesList == null;

            //        if (IsNew)
            //        {
            //            ID = 1;
            //            try { ID = context.QuesLists.Max(m => m.ID) + 1; }
            //            catch { ID = 1; }
            //            context.QuesLists.Add(this);
            //        }

            //        else
            //        {
            //            //if (tempQuesList != null)
            //            //    context.CreateObjectSet<QuesList>().Detach(tempQuesList);

            //            //context.CreateObjectSet<QuesList>().Attach(this);
            //            //context.ObjectStateManager.ChangeObjectState(this, EntityState.Modified);
            //        }
            //        context.SaveChanges();
            //    }
            //}
            //catch (Exception ex)
            //{
            //    Cmn.LogError(ex, "QuesList()");
            //    Message += ex.Message;
            //}
            //return Message;
            return null;
        }

       
    }
