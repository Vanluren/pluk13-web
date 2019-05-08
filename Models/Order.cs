using System;
using System.Collections.Generic;
using System.Data;
namespace pluk13_web.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public List<Product> Products { get; set; }
        public List<Gift> Gifts { get; set; }
        public Order(int id)
        {
            OrderId = id;
        }
    }
}
