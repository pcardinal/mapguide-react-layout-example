import psycopg2
from lxml import etree
from bs4 import BeautifulSoup
import xml.etree.cElementTree as ET
import requests

print("Hello World")

root = ET.Element("multizones")


conn = None
try:
    conn = psycopg2.connect(
        host="localhost",
        port="5434",
        database="postgres",
        user="postgres",
        password="hex_1357")

    # create a cursor
    # cur = conn.cursor()

    # execute a statement
    # print('PostgreSQL database version:')
    # cur.execute('SELECT version()')

    # display the PostgreSQL database server version
    # db_version = cur.fetchone()
    # print(db_version)

    # close the communication with the PostgreSQL
    # cur.close()

    fichier = open("../resources/mz.xml", "w")
    fichier.write('<?xml version="1.0" encoding="utf-8"?>\n')
    fichier.close()

    with conn.cursor() as cur:
        # cur.execute('SELECT * from mz order by  coord_ref_sys_name, base_crs_code ')
        # cur.execute('SELECT * from mz order by  mz, coord_sys_code ')
        cur.execute('SELECT * from mz order by  mz, info, zone, scope_code')

        mz_name_prev = ""
        mz_prev = ""
        coord_sys_code_prev = ""
        info_prev = ""

        for record in cur:
            print(record)
            info = record[9]

            if (info is not None):
                mz = record[1]
                zone = record[0]
                coord_sys_code = record[4]

                api_url = "https://epsg.io/"+str(record[2])+".proj4"
                # api_url = "https://epsg.io/2986.proj4"
                response = requests.get(api_url)
                proj4_data = response.text

                if (response.status_code != 404):

                    if response.text.find("\"National 84 (02.07.01).gsb\"") > 0:
                        # +nadgrids="National 84 (02.07.01).gsb"
                        proj4_data = response.text.replace(
                            "\"National 84 (02.07.01).gsb\"", "National_84_02_07_01.gsb")

                    if (info == 0):

                        if (zone is not None):
                            mz = mz + " / " + zone.strip()

                        mz_xml = ET.SubElement(root, "mz", name=mz)

                    else:

                        mz = mz + zone[0:zone.strip().find(" ")+1] + \
                            " (" + str(record[3]) + ")"

                        if (mz_prev != mz) or (info != info_prev):
                            mz_xml = ET.SubElement(root, "mz", name=mz)
                            mz_prev = mz
                            info_prev = info
                            # coord_sys_code_prev = coord_sys_code

                    if (zone is not None):
                        zone = zone.strip()
                    epsg = ET.SubElement(mz_xml, "epsg", code=str(record[2]))
                    ET.SubElement(epsg, "xmin").text = str(record[6])
                    ET.SubElement(epsg, "ymin").text = str(record[5])
                    ET.SubElement(epsg, "xmax").text = str(record[8])
                    ET.SubElement(epsg, "ymax").text = str(record[7])
                    ET.SubElement(epsg, "zone").text = zone

                    ET.SubElement(epsg, "proj4").text = proj4_data

    # cur.close()  avec with le cur se ferme en fin de boucle

    tree = ET.ElementTree(root)

    ET.indent(tree, space="\t", level=0)

    # tree.write("../resources/mz.xml", encoding="utf-8")

    with open("../resources/mz.xml", "at") as f:
        tree.write(f, encoding='unicode')

    # f.close() avec with


except (Exception, psycopg2.DatabaseError) as error:
    print(error)

finally:
    if conn is not None:
        conn.close()
        print('Database connection closed.')
