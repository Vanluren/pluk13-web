using System;
using System.Collections.Generic;
using System.Data;
using MySql.Data.MySqlClient;
namespace pluk13_web.Helpers
{
    public class DBHelper
    {

        public MySqlConnection dbConnection;
        private string serverName;
        private string databaseName;
        private string username;
        private string password;
        public DBHelper()
        {
            // Set instance variables, maybe from an env file. 
            serverName = "localhost";
            databaseName = "Projekt";
            username = "root";
            password = string.Empty;

            string createConString = "SERVER=" + serverName + ";" + "DATABASE = " + databaseName + ";" + "UID=" + username + ";" + "PASSWORD=" + password + ";";

            dbConnection = new MySqlConnection(createConString);
        }

        public bool OpenDbConnection()
        {
            try
            {
                dbConnection.Open();
                Console.WriteLine("MySQL version : {0}", dbConnection.ServerVersion);
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
            } catch(Exception err) {
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
