<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="reg.aspx.cs" Inherits="SfSoft.web.reg.emc.reg" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>���EMC-��ҵЭͬ�칫����ϵͳ</title>
    <meta http-equiv="Content-Type" content="text/html; charset=gb2312">
    <link rel="stylesheet" type="text/css" href="/emc/css/emccss.css" />
</head>
<body>
    <form id="form1" runat="server">
    <div style="overflow: hidden; height: 40px; background: url(/images/top-bg.jpg) #5D9ADF;
        line-height: 20px; color: #fff; font-family: Verdana, ΢���ź�,����">
        <span style="padding-left: 0px; font-size: 16px; width: 550px; float: left;">
            <table border="0" cellpadding="0" cellspacing="0" height="33px">
                <td width="52px">
                    <img src="/images/logo.png" />
                </td>
                <td>
                    <div runat="server" id="EMCLOGO" class="emclogo" style="width: 500px">
                    </div>
                </td>
                <td width="32px">
                </td>
            </table>
        </span><span></span>
    </div>
    <table width="100%" border="0" cellpadding="0" cellspacing="0" height="30" bgcolor="#91C8FF">
        <tr bgcolor="#9B9B9B">
            <td height="1" width="82">
            </td>
            <td height="1" width="934">
            </td>
            <td height="1" colspan="2" width="3">
            </td>
        </tr>
        <tr>
            <td width="82">
                &nbsp;
            </td>
            <td width="934" >
                <font size="3"><b><font color="#FFFFFF">�û�����ע�᣺</font></b></font> <font face="Verdana">
                    EMCΪ����Ƽ����ڲ�ϵͳ��������Ϣ����Ϊ�ڲ����ܣ�Ϊ�˱����ڲ���Ϣ�İ�ȫ����ʵʩEMC�û���֤��
            </td>
            <td width="3">
                &nbsp;
            </td>
        </tr>
    </table>
    <table width="100%" border="0">
        <tr>
            <td width="15%">
                &nbsp;
            </td>
            <td width="75%">
                <span class="style1">
                    <p>
                        <br>
                        </font><font face="Verdana">�û���֪��<br>
                        </font><font face="Verdana">1����������EMC��½���û������ǹ�˾��Ա�������������ǹ�˾��֤�Ļ���<br>
                        </font><font face="Verdana">2��ԭ����ÿ��ֻ����ʹ��һ��������½��Ա�������Ա��˵�ע���½������ʹ�����˵�ע��<br>
                        </font><font face="Verdana">3����ѡ����ȷ�ĵ����࣬���ֲ���ʱ���������ᱻͨ��<br>
                        </font><font face="Verdana">4����������ע��/��������ע����û�����ע��ԭ����������Ϊ�յ�һ�ɲ���ͨ������Ա����ע������Ա������<br>
                        </font><font face="Verdana">5����˾���з����������������Ա�������룬��֧����������ָ�������������Ա��������<br>
                        </font><font face="Verdana">6���������øı������������ģ��µ��û���֤���뽫����ɵ��û���֤����,�û���֤���뽫�ᱻɾ��������ע������ԭ��<br>
                        </font><font face="Verdana">7������ҵ��ԭ���������̨������½��֤�ı���ע��ԭ�򣬷���������<br>
                            8���ʼǱ�������Ҫ��������ϵ�к��Ա�˶ԣ����ṩ����Ϣ�����뽫����ͨ��������֤�ıʼǱ�������ע�Ᵽ���ڲ���Ϣ�İ�ȫ��<br>
                        </font><font face="Verdana">9����ְ��Ա����֤����Ա����ְ��ɾ��<br>
                        </font><font face="Verdana">10���緢�ֶ����֤���ᱻɾ��</font><font face="Verdana"><br>
                            ���û���������Ҫ��������֤��лл������</font></p>
                </span>
            </td>
            <td width="15%">
                &nbsp;
            </td>
            <tr>
                <td>
                </td>
                <td>
                    <table class="fromtable">
                        <tr>
                            <td>
                                ����
                            </td>
                            <td>
                                <asp:TextBox ID="txtCnName" runat="server" MaxLength="30" Width="200px"></asp:TextBox><font
                                    color="red">*</font>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                ���֤����
                            </td>
                            <td>
                                <asp:TextBox ID="txtIDCard" runat="server" MaxLength="18" Width="200px"></asp:TextBox><font
                                    color="red">*</font>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                ����ʹ������
                            </td>
                            <td>
                                <asp:DropDownList ID="ddlComputerKind" runat="server">
                                </asp:DropDownList>
                                <font color="red">*</font>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                ������
                            </td>
                            <td>
                                <asp:TextBox ID="txtComputerID" runat="server" MaxLength="30" Width="200px" SkinID="txtBoxRedonly"></asp:TextBox><font
                                    color="red">*</font>
                                <label id="lblMsg" runat="server">
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                ��������
                            </td>
                            <td>
                                <asp:TextBox ID="txtRemark" runat="server" MaxLength="30" Width="200px"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Ʒ��
                            </td>
                            <td>
                                <asp:TextBox ID="txtBrand" runat="server" MaxLength="30" Width="200px"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                �ͺ�
                            </td>
                            <td>
                                <asp:TextBox ID="txtComputerType" runat="server" MaxLength="30" Width="200px"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                ���к�
                            </td>
                            <td>
                                <asp:TextBox ID="txtComputerSn" runat="server" MaxLength="30" Width="200px"></asp:TextBox>
                            </td>
                        </tr>
                    </table>
                    <table class="toolbars" style="width: 100%">
                        <tr>
                            <td>
                                <asp:Button ID="btnSubmit" runat="server" Text="�ύ" CssClass="btn" OnClick="btnSubmitClick" />
                                <input type="button" name="Button2" value="ˢ��" class="btn" onclick="javascript:document.location='reg.aspx'" />
                                <input type="button" name="Button2" value="����" class="btn" onclick="javascript:document.location='reginfo.aspx'" />
                                &nbsp;&nbsp;<asp:Label ID="lblResult" runat="server" ForeColor="Red"></asp:Label>
                                ���������ȡ�����������������,��ˢ�µ�ǰҳ�棡
                            </td>
                        </tr>
                    </table>
                </td>
                <td>
                </td>
            </tr>
        </tr>
    </table>
    <iframe id="clientFrame" src="getclient.aspx" style="display: none;"></iframe>
    </form>
</body>
</html>
