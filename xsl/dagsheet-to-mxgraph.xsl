<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output omit-xml-declaration="yes" indent="yes"/>
    <xsl:strip-space elements="*"/>

    <xsl:variable name="d">30</xsl:variable>

    <xsl:template match="page">
        <mxGraphModel>
            <root>
                <mxCell id="0"/>
                <mxCell id="1" parent="0"/>
                <xsl:apply-templates select="node()|@*"/>
            </root>
        </mxGraphModel>
    </xsl:template>

    <xsl:template match="box">
        <mxCell id="{@id}" vertex="1" parent="1">
            <Object formula="{.}" as="value"/>
            <mxGeometry x="{($d * @x) - ($d * @w div 2)}" y="{($d * @y) - ($d div 2)}" width="{$d * @w}" height="{$d}" as="geometry"/>
        </mxCell>
    </xsl:template>


    <xsl:template match="arrow">
        <mxCell id="{generate-id()}" edge="1" parent="1" source="{@from}" target="{@to}">
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