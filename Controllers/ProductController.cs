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

        public Product GetProductById(int id)
        {
            var queryRes = dbHelper.SelectQuery("SELECT * FROM Products WHERE product_id=" + id);
            if (queryRes.Rows.Count > 0)
            {
                Product product = new Product(id, queryRes.Rows[0][1].ToString(), queryRes.Rows[0][2].ToString());
                product.Brand = queryRes.Rows[0]["brand"].ToString();
                product.Size = queryRes.Rows[0]["size"].ToString();
                product.OtherInfo = queryRes.Rows[0]["other_info"].ToString();
                product.Location = queryRes.Rows[0]["wh_location"].ToString();
                //product.Type = queryRes.Rows[0]["type"].ToString();
                return product;
            }
            return null;
        }
        DBHelper dbHelper = new DBHelper();
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<Product>> GetAllProducts()
        {
            var queryRes = dbHelper.SelectQuery("SELECT * FROM Products");
            if (queryRes.Rows.Count > 0)
            {
                List<Product> listOfProducts = new List<Product>();
                foreach (DataRow row in queryRes.Rows)
                {
                    Product product = GetProductById((int)row["product_id"]);
                    listOfProducts.Add(product);
                }
                return Ok(listOfProducts);
            }
            return NotFound();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<Product> GetProductByIdAction(int id)
        {
            Product product = GetProductById(id);

            if (product != null)
            {
                return Ok(product);
            }
            return NotFound();

        }

        [HttpPost]
        public ActionResult<Product> CreateProduct([FromBody]JObject value)
        {

            Product posted = value.ToObject<Product>();
            string title = value.GetValue("title").ToString();
            string location = value.GetValue("location").ToString();

            string statement =
            "INSERT INTO Products (product_title, wh_location) VALUES (" + title + ", " + location + ");";
            bool res = dbHelper.InsertQuery(statement);
            return CreatedAtAction(nameof(CreateProduct), posted);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            dbHelper.DeleteQuery("DELETE FROM Products WHERE product_id=" + id + ";");
            string response = "Deleted product: " + id;
            return AcceptedAtAction(nameof(GetAllProducts), response);
        }
    }
}
