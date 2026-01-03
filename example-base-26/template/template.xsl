<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>User List</title>
        <style>
          body { font-family: sans-serif; margin: 20px; }
          .user { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h2>User List</h2>
        <xsl:for-each select="users/user">
          <div class="user">
            <strong><xsl:value-of select="name"/></strong><br/>
            <span><xsl:value-of select="role"/></span>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>