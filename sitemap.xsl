<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <head>
        <title>ICT Integrated Hub - Sitemap</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f8f9fa;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #2c1e0f, #2c1e0f);
            color: white;
            padding: 25px;
            text-align: center;
            border-radius: 12px 12px 0 0;
            margin-bottom: 0;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            background: #2c1e0f;
            color: white;
            padding: 15px;
            text-align: left;
          }
          td {
            padding: 14px 15px;
            border-bottom: 1px solid #eee;
          }
          tr:hover {
            background: #f8f9ff;
          }
          a {
            color: #2c1e0f;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .footer {
            text-align: center;
            padding: 15px;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo"> ICT Integrated Hub</div>
            <p>One Stop Tech Hub in Nigeria</p>
            <h1>Website Sitemap</h1>
          </div>
          
          <table>
            <tr>
              <th>Page URL</th>
              <th>Last Updated</th>
              <th>Change Frequency</th>
              <th>Priority</th>
            </tr>
            <xsl:for-each select="urlset/url">
              <tr>
                <td><a href="{loc}"><xsl:value-of select="loc"/></a></td>
                <td><xsl:value-of select="lastmod"/></td>
                <td><xsl:value-of select="changefreq"/></td>
                <td><xsl:value-of select="priority"/></td>
              </tr>
            </xsl:for-each>
          </table>
          
          <div class="footer">
            © 2026 ICT Integrated Hub • All Rights Reserved
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>