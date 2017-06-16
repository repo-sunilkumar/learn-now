namespace learn_now_api.Models
    {
    // Models used as parameters to AccountController actions.

    public class InputQuestionDTO
        {
        public int ID { get; set; }
        public string Ans { get; set; }
        public string Ques { get; set; }
        public int Topic { get; set; }
        }
    }
