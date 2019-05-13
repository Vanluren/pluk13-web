using System.Collections.Generic;

namespace pluk13_web.Models
{
    public class Gift
    {
        public int GiftId { get; set; }
        public string GiftTitle { get; set; }
        public List<Product> Contents { get; set; }

        public int GiftQuantity { get; set; }
        public Gift(int id, string title)
        {
            GiftId = id;
            GiftTitle = title;
        }
    }
}
