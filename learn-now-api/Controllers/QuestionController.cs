using learn_now_api.Models;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace learn_now_api.Controllers
    {
    [RoutePrefix("api/Question")]
    public class QuestionController : ApiController
        {
        public QuestionController()
            {
            }

        [HttpPost]
        [Route("SaveQuestion")]
        public HttpResponseMessage SaveQuestion(InputQuestionDTO inputDTO)
            {
            QuesList ques = null;

            if (inputDTO.ID != 0)
                ques = QuesList.GetByID(inputDTO.ID);

            if (ques == null)
                {
                ques = new QuesList();
                }

            ques.Question = inputDTO.Ques;
            ques.Answer = Cmn.GetCompressed(inputDTO.Ans);
            ques.AnswerLength = inputDTO.Ans.Length;
            ques.Language = inputDTO.Topic;
            ques.Reviewed = 0;
            ques.Type = (int)QuestionType.Course;
            ques.Save();
            return Request.CreateResponse(HttpStatusCode.OK, true);
            }

        public HttpResponseMessage GetQuestions([FromUri] string TopicUrl, [FromUri] int PageNo, [FromUri] int quesType = 0)
            {
            Topic tp = Global.GetTopicByURL(TopicUrl);
            if (tp == null)
                {
                return Request.CreateResponse(HttpStatusCode.OK, new List<QuesList>());
                }

            int recordsToSkip = PageNo == 1 ? 0 : ((PageNo - 1) * Global.RecordsPerPage);

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
                return Request.CreateResponse(HttpStatusCode.OK, new { total = QList.Count, currentpage = PageNo, perpage = Global.RecordsPerPage, ques = newlist });
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

                return Request.CreateResponse(HttpStatusCode.OK, new { total = QList.Count, currentpage = PageNo, perpage = Global.RecordsPerPage, ques = newlist });
                }
            }
        }
    }
