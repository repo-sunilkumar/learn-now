using learn_now_api.Models;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace learn_now_api.Controllers
    {
    [RoutePrefix("api/Topic")]
    public class TopicController : ApiController
        {
        public TopicController()
            {
            }

        [HttpGet]
        public HttpResponseMessage GetAllTopic()
            {
            List<Topic> prnts = Global.TopicList.ToList();
            var newlist = prnts.Select(a => new
                {
                id = a.ID,
                name = a.Name
                }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, newlist);

            }
        }
    }
