<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output omit-xml-declaration="yes" indent="yes"/>
    <xsl:strip-space elements="*"/>

    <!--
      Would like to import these so the two sheets will be in sync,
      but Chrome doesn't support it:
      https://bugs.chromium.org/p/chromium/issues/detail?id=8441#c30
    -->
    <xsl:variable name="d">30</xsl:variable>
    <xsl:variable name="parent_id">my_parent</xsl:variable>
    <xsl:variable name="root_id">my_root</xsl:variable>

    <xsl:template match="root">
        <page>
            <xsl:apply-templates select="node()|@*"/>
        </page>
    </xsl:template>

    <xsl:template match="mxCell"><!-- No output --></xsl:template>

    <xsl:template match="mxCell[@vertex=1]">
        <!-- The serializer seems to drop attributes if they equal zero.
             sum() is a work-around. -->
        <xsl:variable name="x" select="sum(./mxGeometry/@x)"/>
        <xsl:variable name="y" select="sum(./mxGeometry/@y)"/>
        <xsl:variable name="width" select="sum(./mxGeometry/@width)"/>
        <box id="{@id}"
             x="{($x + $width div 2) div $d}"
             y="{($y + $d div 2) div $d}"
             w="{$width div $d}">
            <!-- TODO: adjust based on width. -->
            <xsl:value-of select="./Object/@formula"/>
        </box>
    </xsl:template>

    <xsl:template match="mxCell[@edge=1]">
        <arrow from="{./@source}" to="{./@target}">
            <xsl:if test="./mxGeometry/Array">
                <xsl:attribute name="x">
                    <xsl:value-of select="./mxGeometry/Array/Object/@x div $d"/>
                </xsl:attribute>
                <xsl:attribute name="y">
                    <xsl:value-of select="./mxGeometry/Array/Object/@y div $d"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:value-of select="./Object/@label"/>
        </arrow>
    </xsl:template>

    <xsl:template match="mxGraphModel">
        <!-- This is needed by Chrome. -->
        <xsl:apply-templates select="node()|@*"/>
    </xsl:template>

    <xsl:template match="node()|@*">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>

</xsl:stylesheet>