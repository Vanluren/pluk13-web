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
    [Route("api/products")]
    public class ProductController : Controller
    {
        DBHelper dbHelper = new DBHelper();
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<Product>> GetAllProducts()
        {
            List<Product> listOfProducts = new List<Product>();
            var queryRes = dbHelper.SelectQuery("SELECT * FROM ProductInfo");
            foreach (DataRow row in queryRes.Rows)
            {
                listOfProducts.Add(new Product((int)row["product_id"], row["product_title"].ToString(), row["wh_location"].ToString()));
            }
            if (listOfProducts.Count <= 0)
            {
                return NotFound();
            }
            return Ok(listOfProducts);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Product> GetProductByID(int id)
        {
            var queryRes = dbHelper.SelectQuery("SELECT * FROM ProductInfo WHERE product_id=" + id);
            if (queryRes.Rows.Count == 0)
            {
                return NotFound();
            }
            Product product = new Product(id, queryRes.Rows[0][1].ToString(), queryRes.Rows[0][2].ToString());
            //product.Type = queryRes.Rows[0]["type"].ToString();
            product.Brand = queryRes.Rows[0]["brand"].ToString();
            product.Size = queryRes.Rows[0]["size"].ToString();
            product.OtherInfo = queryRes.Rows[0]["other_info"].ToString();
            product.Location = queryRes.Rows[0]["wh_location"].ToString();
            return Ok(product);

        }

        [HttpPost]
        public ActionResult<Product> CreateProduct([FromBody]JObject value)
        {

            Product posted = value.ToObject<Product>();
            string title = value.GetValue("title").ToString();
            string location = value.GetValue("location").ToString();

            string statement =
            "INSERT INTO ProductInfo (product_title, wh_location) VALUES (" + title + ", " + location + ");";
            bool res = dbHelper.InsertQuery(statement);
            return CreatedAtAction(nameof(CreateProduct), posted);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            dbHelper.DeleteQuery("DELETE FROM ProductInfo WHERE product_id=" + id + ";");
            string response = "Deleted product: " + id;
            return AcceptedAtAction(nameof(GetAllProducts), response);
        }
    }
}
