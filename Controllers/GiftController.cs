using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using pluk13_web.Helpers;
using pluk13_web.Models;

namespace pluk13_web.Controllers
{
    [Route("api/gifts")]
    public class GiftController : Controller
    {
        DBHelper dbHelper = new DBHelper();
        [HttpGet]
        public ActionResult<List<Gift>> GetAllGifts()
        {
            List<Gift> listOfGifts = new List<Gift>();
            var query = dbHelper.SelectQuery("SELECT * FROM Gifts;");
            if (query.Rows.Count > 0)
            {
                foreach (DataRow row in query.Rows)
                {
                    List<Product> listOfProducts = new List<Product>();

                    Gift gift = new Gift((int)row["gift_id"], row["gift_title"].ToString());
                    var productQuery = dbHelper.SelectQuery(@"SELECT gc.*, g.gift_title
                                                                FROM
                                                                    GiftContent gc
                                                                        LEFT JOIN
                                                                    Gifts g ON gc.gift_id = g.gift_id
                                                                WHERE 
                                                                    gc.gift_id=" + row["gift_id"].ToString()
                                                                );
                    foreach (DataRow productRow in productQuery.Rows)
                    {
                        Product product = new ProductController().GetProductById((int)row["gift_id"]);
                        listOfProducts.Add(product);
                    }
                    gift.Contents = listOfProducts;
                    listOfGifts.Add(gift);
                }
                return Ok(listOfGifts);
            }
            return NotFound();
        }

        public Gift GetGiftById(int id)
        {
            var query = dbHelper.SelectQuery("SELECT gc.gift_id, g.gift_title, p.* FROM Projekt.GiftContent gc LEFT JOIN Projekt.Gifts g ON gc.gift_id = g.gift_id LEFT JOIN Projekt.Products p ON gc.product_id = p.product_id where gc.gift_id=" + id);
            if (query.Rows.Count > 0)
            {
                List<Product> productsInGift = new List<Product>();
                Gift gift = new Gift((int)query.Rows[0]["gift_id"], query.Rows[0]["gift_title"].ToString());
                foreach (DataRow row in query.Rows)
                {
                    Product product = new ProductController().GetProductById((int)row["product_id"]);
                    productsInGift.Add(product);
                }
                gift.Contents = productsInGift;
                return gift;
            }
            return null;
        }

        [HttpGet("{id}")]
        public ActionResult<Gift> GetGiftByIdAction(int id)
        {
            Gift gift = GetGiftById(id);

            if (gift != null)
            {
                return Ok(gift);
            }
            return NotFound();
        }
    }
}
