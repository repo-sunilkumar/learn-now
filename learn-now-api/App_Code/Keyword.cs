using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Web;

using System.Text;
public partial class Keyword
{
    public string Message = "";
   
    Database db =null;
    IDataReader dr = null;
    string query, Error = "";

    public Keyword()
    {

    }

    public static List<Keyword> KeywordListCache = new List<Keyword>();

    public static string GetKeywordName(int ID)
    {
        var obj = KeywordListCache.FirstOrDefault(m => m.ID == ID);
        return obj == null ? "" : obj.Name;
    }

    public void LoadKeywords()
    {
        KeywordListCache.Clear();
        db = new Database(Global.ConnectionStringDB);
        try
        {
            query = "Select * from Keyword ORDER BY Name";
            dr = db.GetDataReader(query, ref Error);
            if (dr != null)
            {
                while (dr.Read())
                {
                    KeywordListCache.Add(new Keyword() { ID = Cmn.ToInt(dr["ID"]), LanguageID = Cmn.ToInt(dr["LanguageID"]), Name = dr["Name"].ToString() });
                }
            }
        }
        catch (Exception ex)
        {
            Message += ex.Message;
        }
        finally { db.Close(); }
    }


    public int Save()
    {
        db = new Database(Global.ConnectionStringDB);
        try
        {
            query = "Select * from Keyword WHERE LanguageID=" + LanguageID + " AND Name='" + Name + "'";
            int n = db.GetCount(query, ref Error);
            if (n == 0)
            {
                ID = Cmn.ToInt(db.GetFieldValue("SELECT Max(ID) from Keyword", ref Error)) + 1;
                query = "INSERT INTO Keyword(ID, LanguageID,Name) VALUES(" + ID + "," + LanguageID + "," + Cmn.GetStringValueForQuery(Name) + ")";
            }
            else
                query = "UPDATE Keyword SET LanguageID=" + LanguageID + ", Name=" + Cmn.GetStringValueForQuery(Name);
            db.RunQuery(query);
        }
        catch (Exception ex)
        {
            Message = ex.Message;
            ID = 0;
        }
        finally { db.Close(); }
        return ID;
    }



    public int ID { get; set; }

    public int LanguageID { get; set; }

    public string Name { get; set; }
}