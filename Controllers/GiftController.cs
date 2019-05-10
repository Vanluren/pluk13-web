using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;
using pluk13_web.Helpers;
using pluk13_web.Models;

namespace pluk13_web.Controllers
{
    [Route("api/gifts")]
    public class GiftController : Controller
    {
        DBHelper dbHelper = new DBHelper();

        public Gift GetGiftById(int id)
        {
            var query = dbHelper.SelectQuery(@"SELECT
                                                    *
                                                FROM
                                                    Projekt.Gifts
                                                WHERE
                                                    gift_id = " + id + ";");
            if (query.Rows.Count > 0)
            {
                Gift gift = new Gift((int)query.Rows[0]["gift_id"], query.Rows[0]["gift_title"].ToString());
                return gift;
            }
            return null;
        }
        public Gift GetGiftProducts(int id)
        {
            Gift gift = GetGiftById(id);
            if (gift != null)
            {
                var query = dbHelper.SelectQuery(@"SELECT
                                                    g.*, gc.product_id
                                                FROM
                                                    Projekt.Gifts g
                                                        INNER JOIN
                                                    Projekt.GiftContent gc ON g.gift_id = gc.gift_id
                                                WHERE
                                                    g.gift_id = " + id + ";");
                if (query.Rows.Count > 0)
                {
                    List<Product> productsInGift = new List<Product>();
                    foreach (DataRow row in query.Rows)
                    {
                        Product product = new ProductController().GetProductById((int)row["product_id"]);
                        productsInGift.Add(product);
                    }
                    gift.Contents = productsInGift;
                    return gift;
                }
            }
            return gift;
        }

        public List<Gift> GetAllGifts()
        {
            var query = dbHelper.SelectQuery("SELECT * FROM Gifts;");
            if (query.Rows.Count > 0)
            {
                List<Gift> listOfGifts = new List<Gift>();
                foreach (DataRow row in query.Rows)
                {
                    List<Product> listOfProducts = new List<Product>();

                    Gift gift = GetGiftProducts((int)row["gift_id"]);
                    listOfGifts.Add(gift);
                }
                return listOfGifts;
            }
            return null;
        }

        [HttpGet("{id}")]
        public ActionResult<Gift> GetGiftByIdHTTPAction(int id)
        {
            Gift gift = GetGiftById(id);

            if (gift != null)
            {
                return Ok(gift);
            }
            return NotFound("Gift with id: " + id + " not found");
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<List<Gift>> GetAllGiftsHTTPAction()
        {
            List<Gift> listOfGifts = new List<Gift>();
            listOfGifts = GetAllGifts();
            if (listOfGifts.Count > 0 || listOfGifts != null)
            {
                return Ok(listOfGifts);
            }
            return NotFound("Gift not found");
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Gift> CreateGift([FromBody]JObject giftInfo)
        {

            string title = giftInfo.GetValue("title").ToString();
            JArray contents = (JArray)giftInfo.SelectToken("contents");
            try
            {
                var conn = dbHelper.dbConnection;
                string statement = "INSERT INTO gifts(gift_title) VALUES (@gift_title);select last_insert_id();";
                MySqlCommand command = new MySqlCommand(statement, conn);
                conn.Open();
                command.Parameters.AddWithValue("@gift_title", title);
                int giftId = Convert.ToInt32(command.ExecuteScalar());
                conn.Close();

                statement = "INSERT INTO GiftContent(gift_id, product_id) VALUES ";
                List<string> Rows = new List<string>();
                foreach (int productId in contents)
                {
                    Rows.Add(string.Format("({0},{1})", giftId, productId));
                }
                statement += String.Join(",", Rows) + ";";
                Console.WriteLine(statement);
                command = new MySqlCommand(statement, conn);
                conn.Open();
                command.CommandType = CommandType.Text;
                command.ExecuteNonQuery();
                conn.Close();

                return CreatedAtAction(nameof(CreateGift), GetGiftProducts(giftId));
            }
            catch (MySqlException error)
            {
                return BadRequest(error);
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<List<Gift>> DeleteProduct(int id)
        {
            Gift gift = GetGiftById(id);
            if (gift != null)
            {
                bool res = dbHelper.DeleteQuery("DELETE FROM Gifts WHERE gift_id=" + id + ";");
                List<Gift> newListOfGifts = GetAllGifts();
                return Ok(newListOfGifts);
            }
            return NotFound();
        }
    }
}
