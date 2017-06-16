using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

public class DBCheck
{

    //CheckDatabase
    //CheckTable

    public static void RunSQLFile(Database db, string data)
    {
        string[] Commands = data.Split(new string[] { "GO\r\n" }, StringSplitOptions.RemoveEmptyEntries);
        IDbCommand cmd = new SqlCommand();
        cmd.Connection = db.myconnection;
        foreach (string s in Commands)
        {
            cmd.CommandText = s;
            cmd.ExecuteNonQuery();
        }
    }

    public static void CheckTable(Database db, string TableName, Dictionary<string, string> Fields, string[] PrimaryKeys)
    {
        //fields to be added to all table
        //Fields.Add("LUDate", "[datetime]");
        //Fields.Add("LUBy", "[int]");

        //create table
        string SQL = "CREATE TABLE [" + TableName + "] (";
        string PK = " PRIMARY KEY (";
        foreach (string s in PrimaryKeys)
        {
            SQL += " [" + s + "] " + Fields[s] + ",";
            PK += " [" + s + "] " + ",";
        }

        PK = PK.Substring(0, PK.Length - 1) + ") ";
        SQL = SQL + PK + ") ";

        string err = db.RunQuery(SQL);

        //check for fields
        foreach (string s in Fields.Keys)
        {
            string Err = db.RunQuery("ALTER TABLE [" + TableName + "] ADD [" + s + "] " + Fields[s]);
        }

    }

    public static Boolean UpdateDBStructure(Database db, int Counter)
    {
        Dictionary<string, string> fields = new Dictionary<string, string>();

        switch (Counter)
        {

            case 1://QuesList
                fields.Add("ID", "[int]");
                fields.Add("Language", "[int]");
                fields.Add("Type", "[int]");
                fields.Add("Question", "[nvarchar](200)");
                fields.Add("Tags", "[nvarchar](200)");
                fields.Add("Answer", "[image]");
                fields.Add("AnswerLength", "[int]");
                fields.Add("Reviewed", "[int]");
                CheckTable(db, "QuesList", fields, new string[] { "ID" });

                break;

            case 2://Topic
                fields.Add("ID", "[int]");
                fields.Add("ParentID", "[int]");
                fields.Add("QuesType", "[int]");
                fields.Add("SecondaryLanguage", "[int]");
                fields.Add("IsCategory", "[int]");
                fields.Add("Name", "[nvarchar](50)");
                fields.Add("DisplayName", "[nvarchar](50)");
                fields.Add("URL", "[nvarchar](100)");
                fields.Add("TagLine", "[nvarchar](200)");
                CheckTable(db, "Topic", fields, new string[] { "ID" });
                break;

            case 3://MultipleChoice
                fields.Add("ID", "[int]");
                fields.Add("Language", "[int]");
                fields.Add("Question", "[nvarchar](300)");
                fields.Add("Option1", "[nvarchar](100)");
                fields.Add("Option2", "[nvarchar](100)");
                fields.Add("Option3", "[nvarchar](100)");
                fields.Add("Option4", "[nvarchar](100)");
                fields.Add("Option5", "[nvarchar](100)");
                fields.Add("Answer", "[int]");
                CheckTable(db, "MultipleChoice", fields, new string[] { "ID" });
                break;

            case 4://Article
                fields.Add("ID", "[int]");
                fields.Add("ParentID", "[int]");
                fields.Add("Subject", "[nvarchar](500)");
                fields.Add("Tags", "[nvarchar](100)");
                fields.Add("PostDate", "[datetime]");
                fields.Add("Owner", "[int]");
                CheckTable(db, "Article", fields, new string[] { "ID" });
                break;

            case 5://Keyword
                fields.Add("ID", "[int]");
                fields.Add("LanguageID", "[int]");
                fields.Add("Name", "[nvarchar](50)");
                CheckTable(db, "Keyword", fields, new string[] { "ID" });
                break;

            default:


                return false;
        }
        return true;
    }


    public static Boolean UpdateTutorialDBStructure(Database db, int Counter)
    {
        Dictionary<string, string> fields = new Dictionary<string, string>();

        switch (Counter)
        {

            case 1://Technology
                fields.Add("ID", "[int]");
                fields.Add("Name", "[nvarchar](50)");
                CheckTable(db, "Technology", fields, new string[] { "ID" });
                break;

            case 2://MajorTopic
                fields.Add("ID", "[int]");
                fields.Add("SeqID", "[int]");
                fields.Add("TechID", "[int]");
                fields.Add("Name", "[nvarchar](200)");
                CheckTable(db, "MajorTopic", fields, new string[] { "ID" });
                break;

            case 3://Tutorial
                fields.Add("ID", "[int]");
                fields.Add("SeqID", "[int]");
                fields.Add("ParentID", "[int]");
                fields.Add("Name", "[nvarchar](200)");
                fields.Add("Description", "[image]");
                fields.Add("DescriptionLength", "[int]");
                CheckTable(db, "Tutorial", fields, new string[] { "ID" });
                break;

            default:
                return false;
        }
        return true;
    }
}
