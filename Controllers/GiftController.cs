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
            var query = dbHelper.SelectQuery("SELECT * FROM GiftInfo;");
            if (query.Rows.Count > 0)
            {
                foreach (DataRow row in query.Rows)
                {
                    List<Product> listOfProducts = new List<Product>();
                    Gift gift = new Gift((int)row["gift_id"], row["gift_title"].ToString());
                    var productQuery = dbHelper.SelectQuery("SELECT gc.*, g.gift_title, p.* FROM GiftContent gc LEFT JOIN GiftInfo g ON gc.gift_id = g.gift_id LEFT JOIN ProductInfo p ON gc.product_id = p.product_id where gc.gift_id=" + row["gift_id"].ToString());
                    foreach (DataRow product in productQuery.Rows)
                    {
                        listOfProducts.Add(new Product((int)product["gift_id"], product["product_title"].ToString(), product["wh_location"].ToString()));
                    }
                    gift.Contents = listOfProducts;
                    listOfGifts.Add(gift);
                }
                return Ok(listOfGifts);
            }
            return NotFound();
        }
        [HttpGet("{id}")]
        public ActionResult<Gift> GetGiftById(int id)
        {
            var query = dbHelper.SelectQuery("SELECT gc.gift_id, g.gift_title, p.* FROM Projekt.GiftContent gc LEFT JOIN Projekt.GiftInfo g ON gc.gift_id = g.gift_id LEFT JOIN Projekt.ProductInfo p ON gc.product_id = p.product_id where gc.gift_id=" + id);
            if (query.Rows.Count > 0)
            {
                List<Product> productsInGift = new List<Product>();
                Gift gift = new Gift((int)query.Rows[0]["gift_id"], query.Rows[0]["gift_title"].ToString());
                foreach (DataRow row in query.Rows)
                {
                    productsInGift.Add(new Product((int)row["product_id"], row["product_title"].ToString(), row["wh_location"].ToString()));
                }
                gift.Contents = productsInGift;
                return Ok(gift);
            }
            return NotFound();
        }
    }
}
