--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: all_products_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.all_products_data (
    ap_id integer NOT NULL,
    cover_img jsonb,
    title character varying(255),
    brand character varying(255),
    price numeric(10,2),
    description text,
    category integer,
    ratings numeric(2,1),
    availability integer,
    coloroptions jsonb,
    discounts jsonb,
    shipping jsonb,
    product_id integer
);


ALTER TABLE public.all_products_data OWNER TO postgres;

--
-- Name: all_products_data_ap_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.all_products_data_ap_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.all_products_data_ap_id_seq OWNER TO postgres;

--
-- Name: all_products_data_ap_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.all_products_data_ap_id_seq OWNED BY public.all_products_data.ap_id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id integer NOT NULL,
    product_name character varying(50)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_product_id_seq OWNER TO postgres;

--
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- Name: shopping_cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shopping_cart (
    cid integer NOT NULL,
    ap_id integer,
    isordered smallint DEFAULT 0,
    uid integer,
    quantity integer
);


ALTER TABLE public.shopping_cart OWNER TO postgres;

--
-- Name: shopping_cart_cid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shopping_cart_cid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shopping_cart_cid_seq OWNER TO postgres;

--
-- Name: shopping_cart_cid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shopping_cart_cid_seq OWNED BY public.shopping_cart.cid;


--
-- Name: subscribers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscribers (
    sid integer NOT NULL,
    email character varying(50)
);


ALTER TABLE public.subscribers OWNER TO postgres;

--
-- Name: subscribers_sid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subscribers_sid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscribers_sid_seq OWNER TO postgres;

--
-- Name: subscribers_sid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subscribers_sid_seq OWNED BY public.subscribers.sid;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    uid integer NOT NULL,
    email character varying(50),
    password character varying(255),
    user_type smallint
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_uid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_uid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_uid_seq OWNER TO postgres;

--
-- Name: users_uid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_uid_seq OWNED BY public.users.uid;


--
-- Name: all_products_data ap_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.all_products_data ALTER COLUMN ap_id SET DEFAULT nextval('public.all_products_data_ap_id_seq'::regclass);


--
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Name: shopping_cart cid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_cart ALTER COLUMN cid SET DEFAULT nextval('public.shopping_cart_cid_seq'::regclass);


--
-- Name: subscribers sid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscribers ALTER COLUMN sid SET DEFAULT nextval('public.subscribers_sid_seq'::regclass);


--
-- Name: users uid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN uid SET DEFAULT nextval('public.users_uid_seq'::regclass);


--
-- Data for Name: all_products_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.all_products_data (ap_id, cover_img, title, brand, price, description, category, ratings, availability, coloroptions, discounts, shipping, product_id) FROM stdin;
1	{"1": "https://ik.imagekit.io/triptoServices/Home/Tripto/drivers/5_puc.jpg", "2": "https://ik.imagekit.io/triptoServices/Home/Tripto/drivers/5_puc.jpg"}	Product Title	Brand XYZ	99.99	Lorem ipsum dolor sit amet consectetur adipisicing elit. Et consequuntur suscipit numquam, culpa deserunt fugiat rem commodi! Magni vitae consequatur distinctio! Repudiandae sint nostrum impedit!	1	4.5	1	{"Red": "red_img.jpg", "Blue": "blue_img.jpg"}	{"percentage": 10, "validUntil": "2024-02-01"}	{"cost": 5.99, "estimatedDelivery": "3-5 business days"}	1
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (product_id, product_name) FROM stdin;
1	Headphones
2	Earpods
3	Gaming Console
4	Laptops
5	Oculus
6	Speakers
7	Watches
\.


--
-- Data for Name: shopping_cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shopping_cart (cid, ap_id, isordered, uid, quantity) FROM stdin;
1	1	0	1	6
\.


--
-- Data for Name: subscribers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscribers (sid, email) FROM stdin;
1	dummy@gmail.com
2	eventlink@gmail.com
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (uid, email, password, user_type) FROM stdin;
1	user1@gmail.com	$2b$10$r4Sx/YDgG7Q2lchBaHcPkeg8emnAGYhgkKq.hCMzIy55NUPmQkafm	2
2	gadgetUser@gmail.com	$2b$10$6EnPZH.8Xc8BxmetL4.Obezn7QpC8pqbpUYIvrG12tsFMdDcFZuhK	2
4	user2@gmail.com	$2b$10$9ORCvmEZQRtnciT85KhP8uRDHmzVvDfXTiTk8qZ4c/sK3Bp8ufSUG	2
\.


--
-- Name: all_products_data_ap_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.all_products_data_ap_id_seq', 1, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 7, true);


--
-- Name: shopping_cart_cid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shopping_cart_cid_seq', 1, true);


--
-- Name: subscribers_sid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subscribers_sid_seq', 2, true);


--
-- Name: users_uid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_uid_seq', 4, true);


--
-- Name: all_products_data all_products_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.all_products_data
    ADD CONSTRAINT all_products_data_pkey PRIMARY KEY (ap_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: shopping_cart shopping_cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopping_cart
    ADD CONSTRAINT shopping_cart_pkey PRIMARY KEY (cid);


--
-- Name: subscribers subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscribers
    ADD CONSTRAINT subscribers_pkey PRIMARY KEY (sid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uid);


--
-- PostgreSQL database dump complete
--

