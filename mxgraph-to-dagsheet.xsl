<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output omit-xml-declaration="yes" indent="yes"/>
    <xsl:strip-space elements="*"/>

    <!-- TODO: import these so the two sheets will be in sync. -->
    <xsl:variable name="d">30</xsl:variable>
    <!-- In examples this is an integer, but strings seem to work? -->
    <xsl:variable name="parent_id">my_parent</xsl:variable>
    <xsl:variable name="root_id">my_root</xsl:variable>

    <xsl:template match="mxGraphModel/root">
        <page>
            <xsl:apply-templates select="node()|@*"/>
        </page>
    </xsl:template>
    
    <!-- These are implicit in dagsheet xml. -->
    <xsl:template match="mxCell[@id=$root_id]"></xsl:template>
    <xsl:template match="mxCell[@id=$parent_id]"></xsl:template>

    <xsl:template match="mxCell[@vertex=1]">
        <xsl:variable name="x" select="./mxGeometry/@x"/>
        <xsl:variable name="y" select="./mxGeometry/@y"/>
        <xsl:variable name="width" select="./mxGeometry/@width"/>
        <box x="{$x div $d}" y="{$y div $d}" w="{$width div $d}">
            <!-- TODO: adjust based on width. -->
            <xsl:value-of select="./Object/@formula"/>
        </box>
    </xsl:template>
    
    <xsl:template match="mxCell[@edge=1]">
        <arrow from="./@source" to="./@target">
            <xsl:if test="./mxGeometry/Array">
                <xsl:attribute name="x" select="./mxGeometry/Array/Object/@x div $d"/>
                <xsl:attribute name="y" select="./mxGeometry/Array/Object/@y div $d"/>
            </xsl:if>
            <xsl:value-of select="./Object/@label"/>
        </arrow>
    </xsl:template>

    <xsl:template match="node()|@*">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>

</xsl:stylesheet>