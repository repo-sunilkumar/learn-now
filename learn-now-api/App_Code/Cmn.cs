using System;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Collections.Specialized;
using System.IO.Compression;
using System.Globalization;
using System.Threading;


/// <summary>
/// Summary description for Cmn
/// </summary>
public class Cmn
    {
    public Cmn()
        {
        //
        // TODO: Add constructor logic here
        //
        }
    public static void IsLoggedIn(Page p)
        {
        //Global.LoginType = Login.LoginType.LT_Admin;
        //return;
        //if (!Global.LogInDone)
        //{
        //    Global.FromPage = p.Request.Url.ToString();//
        //    p.Server.Transfer(@"~\Login\Default.aspx");
        //}
        }


    public static string ProperCase(string str)
        {
        CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
        TextInfo textInfo = cultureInfo.TextInfo;
        return textInfo.ToTitleCase(str.Trim().ToLower());
        }
    public static string GetStringValueForQuery(string fieldsvalue)
        {
        return "'" + fieldsvalue + "'";
        }


    public static DateTime MinDate = new DateTime(1900, 1, 1);
    public static void ClearTextBoxes(Control parent)
        {
        foreach (Control ctl in parent.Controls)
            {
            if (ctl.GetType().ToString().Equals("System.Web.UI.WebControls.TextBox"))
                ((TextBox)ctl).Text = "";

            if (ctl.GetType().ToString().Equals("System.Web.UI.WebControls.CheckBox"))
                ((CheckBox)ctl).Checked = false;

            if (ctl.Controls.Count > 0)
                ClearTextBoxes(ctl);
            }
        }

    public static void LogError(Exception ex, string Message)
        {
        //string Filename = HttpContext.Current.Server.MapPath(@"~\Error\Company" + Global.CompanyID + ".txt");
        //string Filename = HttpContext.Current.Server.MapPath(@"~\Error\" + DateTime.Now.ToString("dd-MMM-yyyy").Replace('-','_') + ".txt");
        //File.AppendAllText(Filename, Environment.NewLine + Message);

        //return;

        string Error = DateTime.Now.ToString() + Environment.NewLine;

        if (!string.IsNullOrEmpty(Message))
            Error += Message + Environment.NewLine;

        if (ex != null)
            {
            Error += ex.Message + Environment.NewLine;
            Error += ex.StackTrace + Environment.NewLine;

            //            Error += ex.InnerException.Message !=null ? ex.InnerException.Message : "";
            }
        try
            {
            //File.AppendAllText(Filename, Error);
            }
        catch { File.WriteAllText(HttpContext.Current.Server.MapPath(@"~\errrr.txt"), "Error writing log"); }
        }


    public static int ToInt(string txt)
        {
        int X;
        if (int.TryParse(txt, out X) == false)
            return 0;

        return X;
        }

    public static int ToInt(object txt)
        {
        if (txt == null)
            return 0;

        int X;
        if (int.TryParse(txt.ToString(), out X) == false)
            return 0;

        return X;
        }

    public static double ToDbl(string txt)
        {
        double X;
        if (double.TryParse(txt, out X) == false)
            return 0;

        return X;
        }


    public static DateTime ToDate(object txt)
        {
        if (txt == null)
            return Cmn.MinDate;

        DateTime X;
        if (DateTime.TryParse(txt.ToString(), out X) == false)
            return Cmn.MinDate;

        return X;
        }

    public static Int64 ToInt64(string txt)
        {
        Int64 X;
        if (Int64.TryParse(txt, out X) == false)
            return 0;

        return X;
        }

    public static void AddLiteral(Label lbl, string _literal)
        {
        Literal lt = new Literal();
        lt.Text = _literal;
        lbl.Controls.Add(lt);
        }

    public static void WriteClientScript(Page pg, string Client_Script)
        {
        ClientScriptManager cs = pg.ClientScript;
        string csname1 = "S1";
        if (!cs.IsClientScriptBlockRegistered(pg.GetType(), csname1))
            {
            StringBuilder cstext2 = new StringBuilder();
            cstext2.Append("<script language='javascript' type=text/javascript> \n");
            cstext2.Append(Client_Script);
            cstext2.Append("</script>");
            cs.RegisterClientScriptBlock(pg.GetType(), csname1, cstext2.ToString(), false);
            }
        }


    public static string GetEncode(Page pg)
        {
        string encodings = pg.Request.Headers.Get("Accept-Encoding");
        string encode = "no";

        if (encodings != null)
            {
            encodings = encodings.ToLower();
            if (encodings.Contains("gzip"))
                {
                pg.Response.AppendHeader("Content-Encoding", "gzip");
                encode = "gzip";
                }
            else if (encodings.Contains("deflate"))
                {
                pg.Response.AppendHeader("Content-Encoding", "deflate");
                encode = "deflate";
                }
            }

        return encode;
        }

    public static void WriteFile(string str, string FileName, string CompressionType)
        {
        byte[] buffer = System.Text.Encoding.ASCII.GetBytes(str);

        switch (CompressionType)
            {
            case "gzip":
                {
                FileStream sw = new FileStream(FileName, FileMode.Create);
                GZipStream gz = new GZipStream(sw, CompressionMode.Compress);
                gz.Write(buffer, 0, buffer.Length);
                gz.Close();
                sw.Close();
                }
            break;
            case "deflate":
                {
                FileStream sw = new FileStream(FileName, FileMode.Create);
                DeflateStream dz = new DeflateStream(sw, CompressionMode.Compress);
                dz.Write(buffer, 0, buffer.Length);
                dz.Close();
                sw.Close();
                }
            break;
            default:
                {
                StreamWriter sw = new StreamWriter(FileName, false);
                sw.Write(str);
                sw.Close();
                }
            break;
            }

        File.SetCreationTime(FileName, DateTime.Now);
        }

    public static void WriteResponse(Page p, string Message, string Compression)
        {
        if (Compression == "no" || string.IsNullOrEmpty(Compression))
            p.Response.Write(Message);
        else
            p.Response.BinaryWrite(GetCompressed(Message, Compression));
        }

    public static string getDefaultValueForString(string val, string defaultValue)
        {
        return !string.IsNullOrWhiteSpace(val) ? val : defaultValue;

        }
    public static byte[] GetCompressed(string str, string CompressionType = "gzip")
        {
        CompressionType = getDefaultValueForString(CompressionType, "gzip");

        byte[] buffer = System.Text.Encoding.ASCII.GetBytes(str);
        MemoryStream ms = new MemoryStream();

        switch (CompressionType)
            {
            case "gzip":
                {
                GZipStream gz = new GZipStream(ms, CompressionMode.Compress, true);
                gz.Write(buffer, 0, buffer.Length);
                gz.Close();

                }
            break;
            case "deflate":
                {
                DeflateStream dz = new DeflateStream(ms, CompressionMode.Compress);
                dz.Write(buffer, 0, buffer.Length);
                dz.Close();
                }
            break;
            }

        byte[] compressedData = (byte[])ms.ToArray();
        return compressedData;

        }
    public static DateTime GetIndiaTime()
        {
        return DateTime.Now.ToUniversalTime().AddHours(5).AddMinutes(30);
        }
    public static string GetUnCompressed(byte[] Data, int Size)
        {
        if (Data == null)
            return string.Empty;
        MemoryStream ms = new MemoryStream(Data);
        GZipStream gz = null;
        try
            {

            gz = new GZipStream(ms, CompressionMode.Decompress);
            byte[] decompressedBuffer = new byte[Size];
            int DataLength = gz.Read(decompressedBuffer, 0, Size);
            using (MemoryStream msDec = new MemoryStream())
                {
                msDec.Write(decompressedBuffer, 0, DataLength);
                msDec.Position = 0;
                string s = new StreamReader(msDec).ReadToEnd();
                return s;
                }
            }
        catch
            {
            //return ex.Message;
            }
        finally
            {
            ms.Close();
            gz.Close();
            }

        return string.Empty;
        }


    public static string CreateTable(List<List<string>> Data, int[] widths, int Alignment, Boolean ContainsHeading)
        {
        string HTMLText = "<table cellpadding='0' cellspacing='0' border='1'>";
        string AlignText = "";
        if (Alignment == 0) AlignText = "left"; else if (Alignment == 1) AlignText = "center"; else AlignText = "right";
        for (int i = 0; i < Data.Count; i++)
            {
            HTMLText += (ContainsHeading == true && i == 0) ? "<tr BGCOLOR='#CCCC99'>" : "<tr>";
            List<string> RowData = Data[i];

            for (int j = 0; j < RowData.Count; j++)
                {
                string data = "";
                if (RowData[j] != null && RowData[j].Contains(".v"))
                    {
                    data = "<b>" + RowData[j].Replace(".v", "") + "</b>";
                    HTMLText += "<td align='" + AlignText + "' BGCOLOR='FFCC99' width='" + widths[j] + "%'>" + data + "</td>";
                    }
                else
                    {
                    data = ((ContainsHeading == true && i == 0) ? "<b>" + RowData[j] + "</b>" : RowData[j]);
                    HTMLText += "<td align='" + AlignText + "' width='" + widths[j] + "%'>" + data + "</td>";
                    }
                }
            HTMLText += "</tr>";
            }
        HTMLText += "</table>";
        HTMLText += "<br>";

        return HTMLText;
        }

    public static void AddRow(List<List<string>> table, string[] Data)
        {
        List<string> Row = new List<string>();

        foreach (string s in Data)
            Row.Add(s);
        table.Add(Row);
        }
    }

