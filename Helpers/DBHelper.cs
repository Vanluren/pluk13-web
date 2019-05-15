using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
namespace pluk13_web.Helpers
{
    public class DBHelper
    {
        public MySqlConnection dbConnection;
        public DBHelper()
        {
            //string createConString = "SERVER=157.230.161.29;DATABASE=Projekt;UID=public;PASSWORD='HelloWorldP412345'";
            string createConString = "SERVER=localhost;DATABASE=Projekt;UID=root;PASSWORD=''";
            dbConnection = new MySqlConnection(createConString);
        }

        public bool OpenDbConnection()
        {
            try 
            {
                dbConnection.Open();
                return true;
            }
            catch (MySqlException error)
            {
                switch (error.Number)
                {
                    case 0:
                        Console.WriteLine("Error {0}: Could not connect to server!", error);
                        break;
                    case 1045:
                        Console.WriteLine("Error {0}: Wrong username or password!", error);
                        break;
                }

                return false;
            }
        }

        public bool CloseDbConnection()
        {
            try
            {
                dbConnection.Close();
                return true;
            }
            catch (MySqlException error)
            {
                Console.WriteLine(error + "Could not close connection!");
                return false;
            }
        }
        public DataTable SelectQuery(string query)
        {
            try
            {
                DataTable result = new DataTable();
                OpenDbConnection();

                MySqlCommand command = new MySqlCommand(query, dbConnection);
                MySqlDataAdapter dataAdapter = new MySqlDataAdapter(command);

                dataAdapter.Fill(result);

                CloseDbConnection();
                dataAdapter.Dispose();
                return result;
            }
            catch (Exception err)
            {
                Console.WriteLine("Could not get the queried data");
                throw err;
            }
        }

        //TODO: Gør den her mere alsidig, 
        //den skal tage en række params, som den indsætter: hvis den kan,
        // returner det den har indsat i stedet for true;
        public bool InsertQuery(string query)
        {
            try
            {
                OpenDbConnection();
                MySqlCommand command = new MySqlCommand(query, dbConnection);
                command.ExecuteNonQuery();
                command.Dispose();
                CloseDbConnection();
                return true;
            }
            catch (Exception err)
            {
                Console.WriteLine("Could not insert into DB");
                throw err;
            }
        }

        public bool DeleteQuery(string query)
        {
            try
            {
                OpenDbConnection();
                MySqlCommand command = new MySqlCommand(query, dbConnection);
                MySqlDataAdapter dataAdapter = new MySqlDataAdapter();
                dataAdapter.DeleteCommand = command;
                dataAdapter.DeleteCommand.ExecuteNonQuery();
                command.Dispose();
                CloseDbConnection();
                return true;
            }
            catch (Exception err)
            {
                Console.WriteLine("Could not delete from DB");
                throw err;
            }
        }
    }
}
