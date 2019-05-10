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
                return product;
            }
            return null;
        }
        public List<Product> GetAllProducts()
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
                return listOfProducts;
            }
            return null;
        }
        DBHelper dbHelper = new DBHelper();
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<List<Product>> GetAllProductsAction()
        {
            List<Product> listOfProducts = GetAllProducts();
            if (listOfProducts.Count > 0)
            {
                return Ok(listOfProducts);
            }
            return NotFound();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Product> CreateProduct([FromBody]JObject value)
        {

            string title = value.GetValue("title").ToString();
            string location = value.GetValue("location").ToString();
            // string type = value.GetValue("type").ToString();
            string size = value.GetValue("size").ToString();
            string brand = value.GetValue("brand").ToString();
            string otherInfo = value.GetValue("otherInfo").ToString();
            Product postedProduct = value.ToObject<Product>();

            try
            {
                var conn = dbHelper.dbConnection;
                string statement = "INSERT INTO products(product_title, size, brand, other_info, wh_location) VALUES(@product_title, @size, @brand, @other_info, @wh_location);select last_insert_id();";
                MySqlCommand command = new MySqlCommand(statement, conn);
                dbHelper.dbConnection.Open();
                command.Parameters.AddWithValue("@product_title", title);
                command.Parameters.AddWithValue("@wh_location", location);
                // command.Parameters.AddWithValue("@type", type);
                command.Parameters.AddWithValue("@size", size);
                command.Parameters.AddWithValue("@brand", brand);
                command.Parameters.AddWithValue("@other_info", otherInfo);
                int id = Convert.ToInt32(command.ExecuteScalar());
                postedProduct.ProductId = id;
                conn.Close();

                return CreatedAtAction(nameof(CreateProduct), postedProduct);
            }
            catch (MySqlException error)
            {
                return BadRequest(error);
            }
        }

        [HttpPatch("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Product> UpdateProduct(int id, [FromBody]JObject newProductInfo)
        {

            Product product = GetProductById(id);
            if (product != null)
            {
                string title = newProductInfo.GetValue("title").ToString();
                string location = newProductInfo.GetValue("location").ToString();
                string size = newProductInfo.GetValue("size").ToString();
                string brand = newProductInfo.GetValue("brand").ToString();
                string otherInfo = newProductInfo.GetValue("otherInfo").ToString();
                Product postedProduct = newProductInfo.ToObject<Product>();
                try
                {
                    var conn = dbHelper.dbConnection;
                    string stmt = @"UPDATE 
                                Products
                            SET 
                                product_title = @product_title, 
                                wh_location= @wh_location,
                                size = @size,
                                brand = @brand,
                                other_info = @other_info
                            WHERE 
                                product_id=" + id + ";";

                    MySqlCommand command = new MySqlCommand(stmt, conn);
                    command.Parameters.AddWithValue("@product_title", title);
                    command.Parameters.AddWithValue("@wh_location", location);
                    command.Parameters.AddWithValue("@size", size);
                    command.Parameters.AddWithValue("@brand", brand);
                    command.Parameters.AddWithValue("@other_info", otherInfo);

                    conn.Open();
                    command.ExecuteScalar();
                    postedProduct.ProductId = id;
                    conn.Close();


                    return Ok(GetAllProducts());
                }
                catch (MySqlException error)
                {
                    return BadRequest(error);
                }
            }
            return NotFound();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<List<Product>> DeleteProduct(int id)
        {
            Product product = GetProductById(id);
            if (product != null)
            {
                bool res = dbHelper.DeleteQuery("DELETE FROM Products WHERE product_id=" + id + ";");
                List<Product> newListOfProducts = GetAllProducts();
                return Ok(newListOfProducts);
            }
            return NotFound();
        }
    }
}
