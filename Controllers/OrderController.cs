using System;
using System.Collections.Generic;
using System.Data;
using System.Net;
using System.Net.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;
using pluk13_web.Helpers;
using pluk13_web.Models;

namespace pluk13_web.Controllers
{
    [Route("api/orders")]
    public class OrderController : Controller
    {
        string OrdersTable = "Orders";
        string OrderGiftJunctionTable = "Projekt.OrderGifts";
        string OrderProductsJunction = "Projekt.OrderProducts";
        DBHelper dbHelper = new DBHelper();

        public Order GetOrderById(int orderId)
        {
            var queryRes = dbHelper.SelectQuery("SELECT * FROM" + " " + OrdersTable + " WHERE order_id=" + orderId);
            if (queryRes.Rows.Count > 0)
            {
                Order order = new Order(orderId);
                order.Products = GetProductsForOrder(orderId);
                order.Gifts = GetGiftsForOrder(orderId);
                order.CreatedAt = queryRes.Rows[0]["create_at"].ToString();
                return order;
            }
            return null;
        }
        public List<Product> GetProductsForOrder(int orderId)
        {
            List<Product> products = new List<Product>();
            var productQuery = dbHelper.SelectQuery($@"SELECT 
                                        *
                                    FROM
                                        {OrderProductsJunction}
                                    WHERE
                                        order_id = {orderId};");
            foreach (DataRow productRow in productQuery.Rows)
            {
                Product product = new ProductController().GetProductById((int)productRow["product_id"]);
                product.ProductQuantity = (int)productRow["quantity"];
                products.Add(product);
            }
            return products;
        }

        public List<Gift> GetGiftsForOrder(int orderId)
        {
            List<Gift> gifts = new List<Gift>();
            var giftQuery = dbHelper.SelectQuery($@"SELECT 
                                        *
                                    FROM
                                        {OrderGiftJunctionTable}
                                    WHERE
                                        order_id = {orderId};");
            foreach (DataRow giftRow in giftQuery.Rows)
            {
                Gift gift = new GiftController().GetGiftProducts((int)giftRow["gift_id"]);
                gift.GiftQuantity = (int)giftRow["quantity"];
                gifts.Add(gift);
            }
            return gifts;
        }

        public List<Order> GetAllOrders()
        {
            var queryRes = dbHelper.SelectQuery($"SELECT * FROM {OrdersTable};");
            if (queryRes.Rows.Count > 0)
            {
                List<Order> listOfOrders = new List<Order>();
                foreach (DataRow orderRow in queryRes.Rows)
                {
                    Order order = new Order((int)orderRow["order_id"]);
                    order.Products = GetProductsForOrder((int)orderRow["order_id"]);
                    order.Gifts = GetGiftsForOrder((int)orderRow["order_id"]);
                    order.CreatedAt = orderRow["create_at"].ToString();
                    listOfOrders.Add(order);
                }
                return listOfOrders;
            }
            return null;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<Order>> GetAllOrdersAction()
        {
            List<Order> listOfOrders = GetAllOrders();
            if (listOfOrders.Count > 0)
            {
                return Ok(listOfOrders);
            }
            return NotFound();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Order> GetOrderByIdAction(int id)
        {
            Order order = GetOrderById(id);

            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        private void InsertProductContents(int orderId, JObject products)
        {
            var conn = dbHelper.dbConnection;
            string statement = "INSERT INTO OrderProducts(order_id, product_id, quantity) VALUES ";
            List<string> Rows = new List<string>();
            foreach (KeyValuePair<String, JToken> product in products)
            {
                Rows.Add(string.Format("({0},{1}, {2})", orderId, product.Key, product.Value));
            }
            statement += String.Join(",", Rows) + ";";
            MySqlCommand command = new MySqlCommand(statement, conn);

            conn.Open();
            command.ExecuteNonQuery();
            conn.Close();
        }
        private void InsertOrderGifts(int orderId, JObject gifts)
        {
            var conn = dbHelper.dbConnection;
            string statement = "INSERT INTO OrderGifts(order_id, gift_id, quantity) VALUES ";
            List<string> Rows = new List<string>();
            foreach (KeyValuePair<String, JToken> gift in gifts)
            {
                Rows.Add(string.Format("({0},{1}, {2})", orderId, gift.Key, gift.Value));
            }
            statement += String.Join(",", Rows) + ";";
            MySqlCommand command = new MySqlCommand(statement, conn);

            conn.Open();
            command.ExecuteNonQuery();
            conn.Close();
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Order> CreateNewOrder([FromBody]JObject orderInfo)
        {

            int orderId = (int)orderInfo.GetValue("orderId");
            JObject products = (JObject)orderInfo.SelectToken("products");
            JObject gifts = (JObject)orderInfo.SelectToken("gifts");
            try
            {
                var conn = dbHelper.dbConnection;
                string statement = $"INSERT INTO {OrdersTable}(order_id) VALUES (@order_id);";
                MySqlCommand command = new MySqlCommand(statement, conn);
                conn.Open();
                command.Parameters.AddWithValue("@order_id", orderId);
                int giftId = Convert.ToInt32(command.ExecuteScalar());
                conn.Close();

                InsertProductContents(orderId, products);
                InsertOrderGifts(orderId, gifts);

                return Created(nameof(CreateNewOrder), GetOrderById(orderId));
            }
            catch (MySqlException error)
            {
                return BadRequest(error);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteOrderByid(int orderId)
        {
            dbHelper.DeleteQuery("DELETE FROM" + " " + OrdersTable + " " + "WHERE order_id=" + orderId + ";");
            string response = "Deleted order: " + orderId;
            return AcceptedAtAction(nameof(GetAllOrders), response);
        }
    }
}
