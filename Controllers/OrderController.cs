using System;
using System.Collections.Generic;
using System.Data;
using System.Net;
using System.Net.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
                Gift gift = new GiftController().GetGiftById((int)giftRow["gift_id"]);
                gifts.Add(gift);
            }
            return gifts;
        }

        public List<Order> GetAllOrders()
        {
            var queryRes = dbHelper.SelectQuery("SELECT * FROM" + " " + OrdersTable + ";");
            if (queryRes.Rows.Count > 0)
            {
                List<Order> listOfOrders = new List<Order>();
                foreach (DataRow orderRow in queryRes.Rows)
                {
                    Order order = new Order((int)orderRow["order_id"]);
                    order.Products = GetProductsForOrder((int)orderRow["order_id"]);
                    order.Gifts = GetGiftsForOrder((int)orderRow["order_id"]);
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

        [HttpPost]
        public ActionResult<Order> CreateNewOrder([FromBody] JObject value)
        {

            Order order = value.ToObject<Order>();
            string orderId = value.GetValue("orderId").ToString();

            string statement =
            "INSERT INTO " + OrdersTable + " (order_id) VALUES (" + orderId + ");";
            bool res = dbHelper.InsertQuery(statement);
            return CreatedAtAction(nameof(CreateNewOrder), order);
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
