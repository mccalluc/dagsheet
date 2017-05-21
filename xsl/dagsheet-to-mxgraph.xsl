<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output omit-xml-declaration="yes" indent="yes"/>
    <xsl:strip-space elements="*"/>

    <xsl:variable name="d">30</xsl:variable>
    <!-- In examples this is an integer, but strings seem to work? -->
    <xsl:variable name="parent_id">my_parent</xsl:variable>
    <xsl:variable name="root_id">my_root</xsl:variable>

    <xsl:template match="page">
        <mxGraphModel>
            <root>
                <mxCell id="{$root_id}"/>
                <mxCell id="{$parent_id}" parent="{$root_id}"/>
                <xsl:apply-templates select="node()|@*"/>
            </root>
        </mxGraphModel>
    </xsl:template>

    <xsl:template match="box">
        <xsl:variable name="w"><!-- Default width: Couldn't get more concise XPath to work... -->
            <xsl:choose>
                <xsl:when test="@w"><xsl:value-of select="@w"/></xsl:when>
                <xsl:otherwise>2.5</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <mxCell id="{@id}" vertex="1" parent="{$parent_id}">
            <Object formula="{.}" as="value"/>
            <mxGeometry x="{($d * @x) - ($d * number($w) div 2)}" y="{($d * @y) - ($d div 2)}" width="{$d * number($w)}" height="{$d}" as="geometry"/>
        </mxCell>
    </xsl:template>


    <xsl:template match="arrow">
        <mxCell id="{generate-id()}" edge="1" parent="{$parent_id}" source="{@from}" target="{@to}">
            <Object label="{.}" as="value"/>
            <mxGeometry relative="1" as="geometry">
                <xsl:if test="@x or @y">
                    <Array as="points">
                        <Object x="{@x * $d}" y="{@y * $d}"/>
                    </Array>
                </xsl:if>
            </mxGeometry>
        </mxCell>
    </xsl:template>

    <xsl:template match="node()|@*">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>

</xsl:stylesheet>