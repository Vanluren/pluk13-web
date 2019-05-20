using System;
namespace pluk13_web.Models
{
    public class Product
    {
        public int ProductId { get; set; }
        public string ProductTitle { get; set; }
        public string Type { get; set; }
        public string Size { get; set; }
        public string Brand { get; set; }
        public string OtherInfo { get; set; }
        public string Location { get; set; }
        public int ProductQuantity { get; set; }

        public Product(int id, string title, string location)
        {
            ProductId = id;
            ProductTitle = title;
            Location = location;
        }
    }
}
