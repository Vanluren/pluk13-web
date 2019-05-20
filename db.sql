CREATE DATABASE IF NOT EXISTS Projekt;

USE Projekt;

CREATE TABLE IF NOT EXISTS Products(
    product_id int(6) AUTO_INCREMENT NOT NULL,
    product_title varchar(100) NOT NULL,
    size varchar(20),
    brand varchar(20),
    other_info TEXT,
    wh_location varchar(20) NOT NULL,
    date_time datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(product_id)
);

ALTER TABLE Products AUTO_INCREMENT=00001;

INSERT INTO Products (product_id, product_title, size, brand, other_info, wh_location) VALUES 
(20391, 'Chateau Lamothe-Cissac (rødvin)', '750 ml.', 'Rød Vin', 'Mørke druer, der duer.', 'A-1-2'),
(10505,  'Chateau Lamothe (hvidvid)', '750 ml.', 'Hvid Vin', 'Fransk lækkeri', 'A-1-1'),
(187063, 'Chateau Møllenborg', '750 ml.', 'Hvid Vin', 'Fransk lækkeri fra alsace!', 'N-7-3'),
(187053, 'Chateau Max Bjævermose', '750 ml.', 'Hvid Vin', 'Fransk lækkeri fra alsace!', 'N-7-2'),
(786814, 'Julechokolade', '100 Gram', 'Hvid Vin', 'Fransk lækkeri', 'G-1-3'),
(784816, 'Wienermandelr', '100 Gram', 'Hvid Vin', 'Fransk lækkeri', 'L-1-3'),
(785312, 'Chokolademandler', '100 Gram', 'Hvid Vin', 'Fransk lækkeri', 'A-1-3'),
(100989, 'Rio Grande', '750 ml', 'Hvid Vin', 'Amerikansk/Mexicansk lækkeri', 'K-1-3'),
(45263, 'Beau-Riverage Grande', '750 ml', 'Hvid Vin', 'Fransk lækkeri', 'D-1-3'),
(100780, 'Sort gaveæske riflet', '20x40 cm', 'FirmagaverOnline', 'Kasse til gaver', 'A-2-3'),
(100892, 'En flaske Nero DAvola', '750 ml', '', 'Italiensk rødvin, lækker og god', 'A-12-3'),
(75284, 'Påskeæg - store', '400 Gram', '', 'Italiensk chokolade, vilds god', 'C-1-3'),
(500214, 'Igor Wagner chokolade', '200 Gram', 'Anthon Berg', '', 'B-5');


CREATE table IF NOT EXISTS Gifts(
    gift_id int(6) NOT NULL AUTO_INCREMENT,
    gift_title varchar(100),
    date_time datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(gift_id)
);
INSERT INTO Gifts(gift_id, gift_title) VALUES 
(59905, 'Luksus Julekurv - 1'),
(60121, 'Gastronomi & Vin Grande'),
(60122, 'Dansk & Dejligt i shopping bag Klassisk jul'),
(59904, 'Landpølse & Lækkerier - Stor'),
(60092, 'Italienske delikatesser Grande'),
(60131, 'Global & Lokal i shopping bag'),
(60097, 'Kaffe, te og juleknas'),
(50662, 'Luksus Julekurv - 4'),
(60095, 'Te, chokolade og juleknas i sisalkurv'),
(59901, 'Fransk & Fantastisk - Stor'),
(20391, 'Fantastisk Vin!'),
(60091, 'Franske Fornemmelser');


CREATE TABLE IF NOT EXISTS GiftContent(
gift_id int(5) NOT NULL,
product_id int(6) NOT NULL,
quantity int(100),
FOREIGN KEY(gift_id) REFERENCES Gifts(gift_id)
ON DELETE CASCADE,
FOREIGN KEY (product_id) REFERENCES Products(product_id)
ON DELETE CASCADE
);
INSERT INTO GiftContent(gift_id, product_id, quantity) VALUES
(59905, 20391, 2),
(59905, 10505, 3),
(50662, 785312, 3),
(60121, 785312, 2),
(60122, 20391, 10),
(59904, 785312, 3),
(60092, 20391, 1),
(60131, 785312, 2),
(60095, 500214, 8),
(60095, 785312, 7),
(60095, 20391, 1),
(60095, 785312, 3),
(60097, 500214, 2),
(59901, 786814, 2),
(59901, 20391, 2),
(59901, 10505, 2),
(20391, 10505,  2),
(20391, 187053, 3),
(20391, 100892, 3),
(60091, 20391, 2);

CREATE TABLE IF NOT EXISTS Orders(
order_id int(6) NOT NULL,
create_at datetime DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY(order_id)
);
INSERT INTO Orders (order_id) VALUES 
(459367), 
(279367), 
(784936), 
(781236), 
(784123), 
(784932), 
(46377), 
(12313), 
(12395), 
(46383);

CREATE TABLE IF NOT EXISTS OrderProducts(
order_id int(6),
product_id int(6) NOT NULL,
quantity int(100),
FOREIGN KEY (order_id) REFERENCES Orders(order_id)
ON DELETE CASCADE,
FOREIGN KEY (product_id) REFERENCES Products(product_id)
ON DELETE CASCADE
);
INSERT INTO OrderProducts (order_id, product_id, quantity) VALUES 
(459367, 20391, 2),
(459367, 10505, 3),
(459367, 786814, 3),
(279367, 786814, 2),
(279367, 20391, 10),
(279367, 786814, 3),
(784936, 20391, 1),
(784936, 45263, 2),
(781236, 500214, 8),
(781236, 785312, 7),
(781236, 20391, 1),
(781236, 786814, 3),
(784123, 500214, 2),
(784123, 786814, 2),
(784123, 20391, 2),
(784123, 45263, 2),
(46377, 10505,  2),
(46377, 187053, 3),
(46383, 100892, 3),
(46383, 20391, 2);

CREATE TABLE IF NOT EXISTS OrderGifts(
order_id int(6), 
gift_id int(6),
quantity int(100),
FOREIGN KEY (order_id) REFERENCES Orders(order_id)
ON DELETE CASCADE,
FOREIGN KEY(gift_id) REFERENCES Gifts(gift_id)
ON DELETE CASCADE
);

INSERT INTO OrderGifts (order_id, gift_id, quantity) VALUES 
(12313, 60121, 2),
(12313, 60121, 3),
(12395, 60121, 2),
(12395, 60121, 3),
(459367, 60121, 2),
(459367, 60121, 3),
(459367, 60121, 3),
(279367, 60122, 2),
(279367, 60122, 10),
(279367, 60121, 3),
(784936, 60122, 1),
(784936, 60121, 2),
(781236, 60095, 8),
(781236, 59905, 7),
(781236, 20391, 1),
(781236, 60097, 3),
(784123, 60095, 2),
(784123, 60097, 2),
(784123, 60095, 2),
(784123, 60095, 2),
(784932, 60095, 2),
(784932, 60095, 2),
(46377, 60095,  2),
(46377, 60095,  2),
(46377, 59901,  2),
(46377, 20391,  2),
(46377, 20391,  2),
(46377, 59901, 3),
(46383, 59901, 3),
(46383, 20391, 2);
