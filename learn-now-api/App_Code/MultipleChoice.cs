using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
public partial class MultipleChoice
{
    public string Message = "";
    public string AnswerString = "";
    public string URL = "";

    public MultipleChoice()
    {

    }

    public static MultipleChoice GetMultipleChoiceElement(IDataReader dr)
    {
        MultipleChoice mc = new MultipleChoice()
        {
            ID = Cmn.ToInt(Convert.ToString(dr["ID"])),
            Answer = Cmn.ToInt(Convert.ToString(dr["Answer"])),
            Language = Cmn.ToInt(Convert.ToString(dr["Language"])),
            Option1 = Convert.ToString(dr["Option1"]),
            Option2 = Convert.ToString(dr["Option2"]),
            Option3 = Convert.ToString(dr["Option3"]),
            Option4 = Convert.ToString(dr["Option4"]),
            Option5 = Convert.ToString(dr["Option5"]),
            Question = Convert.ToString(dr["Question"])
        };
        return mc;
    }
    public static List<MultipleChoice> GetResult(string query)
    {
        List<MultipleChoice> obj = new List<MultipleChoice>();
        string error = string.Empty;
        Database db = new Database(Global.ConnectionStringDB);
        try
        {
            IDataReader dr = db.GetDataReader(query, ref error);
            while (dr.Read())
            {
                obj.Add(GetMultipleChoiceElement(dr));
            }
        }
        finally { db.Close(); }
        return obj;
    }

    public static List<MultipleChoice> GetData()
    {
        return GetResult("Select * FROM MultipleChoice Order By Language");
    }

    public static List<MultipleChoice> GetByLanguage(int LanguageID)
    {
        return GetResult("Select * FROM MultipleChoice Where Language="+ LanguageID);
    }
    public static MultipleChoice GetByID(int ID)
    {
        return GetResult("Select * FROM MultipleChoice Where ID=" + ID).FirstOrDefault();
    }

    public static MultipleChoice GetByQuestion(string ques)
    {
        return GetResult("Select * FROM MultipleChoice Where Question='" + ques + "'").FirstOrDefault();
    }

    public string Save()
    {
        //try
        //{
        //    using (NotesEntities context = new NotesEntities())
        //    {

        //        MultipleChoice tempObj = context.MultipleChoices.FirstOrDefault(m => m.ID == ID);
        //        Boolean IsNew = tempObj == null;

        //        if (IsNew)
        //        {
        //            ID = 1;
        //            try { ID = context.MultipleChoices.Max(m => m.ID) + 1; }
        //            catch { ID = 1; }
        //            context.MultipleChoices.Add(this);
        //        }

        //        else
        //        {
        //            //if (tempObj != null)
        //            //    context.MultipleChoices.Create .CreateObjectSet<MultipleChoice>().Detach(tempObj);

        //            //context.CreateObjectSet<MultipleChoice>().Attach(this);
        //            //context.ObjectStateManager.ChangeObjectState(this, EntityState.Modified);
        //        }
        //        context.SaveChanges();
        //    }
        //}
        //catch (Exception ex)
        //{
        //    Cmn.LogError(ex, "MultipleChoice()");
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
            db.RunQuery("DELETE FROM MultipleChoice WHERE ID=" + id);
        }
        catch (Exception ex) { string Message = ex.Message; }
        finally { db.Close(); }
    }

    public string Question { get; set; }

    public int Answer { get; set; }

    public string Option1 { get; set; }

    public int ID { get; set; }

    public int Language { get; set; }

    public string Option2 { get; set; }

    public string Option3 { get; set; }

    public string Option4 { get; set; }

    public string Option5 { get; set; }
}
