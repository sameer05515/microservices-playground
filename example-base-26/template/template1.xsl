<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">

        <html xmlns="http://www.w3.org/1999/xhtml">

            <head>
                <title>User List</title>
                <link rel="stylesheet" href="style.css"/>
            </head>

            <body>

                <h1>User List</h1>

                <table>

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                        </tr>
                    </thead>

                    <tbody>

                        <xsl:for-each select="users/user">

                            <tr>
                                <td class="user-name">
                                    <xsl:value-of select="name"/>
                                </td>

                                <td>
                                    <xsl:value-of select="role"/>
                                </td>
                            </tr>

                        </xsl:for-each>

                    </tbody>

                </table>

            </body>

        </html>

    </xsl:template>

</xsl:stylesheet>