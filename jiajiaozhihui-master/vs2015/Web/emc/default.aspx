<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="SfSoft.web.emc._default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>���-��ҵ��������ϵͳ</title>
    <meta http-equiv="Content-Type" content="text/html; charset=gb2312">
    <link rel="stylesheet" type="text/css" href="css/emccss.css" />
    <link rel="stylesheet" type="text/css" href="css/emchome.css" />
    <link rel="stylesheet" type="text/css" href="/js/themes/default/easyui.css" />
    <script type="text/javascript" src="/js/jquery-1.4.4.min.js"></script>
    <script type="text/javascript" src="/js/jquery.easyui.min.1.2.2.js"></script>
    <script type="text/javascript" src="/js/outlook2.js"></script>
    <script type="text/javascript" src="/js/popup.js"></script>
    <script type="text/javascript" src="/js/popupclass.js"></script>
    <script type="text/javascript" src="/js/jquery.messager.js"></script>
    <style type="text/css">
 
       .emctopmenu{float:left ;padding-left:20px; }
       .emctopmenuli{float:left;margin-right:2px; text-align:center; letter-spacing:3px;  padding:5px 5px 0px 5px ;width:80px;font-weight:bold; color:#fff; background: url(../images/tabbg.png);background-repeat:  repeat-x;height:27px; }
        .emctopmenuli1{float:left;margin-right:2px; text-align:center; letter-spacing:3px;  padding:5px 5px 0px 5px ;width:80px;font-weight:bold; color:#000;background-repeat:  repeat-x;height:27px; }
       .emctopmenuright{float:right; background: url(../images/topmenurightbg.png);background-repeat:no-repeat;height:27px;width:240px;padding-right:1px;}
       .emctopmenurighticon{float:left;margin-left:10px;background: url(../images/icon001.png);background-repeat:no-repeat;background-position:center;height:27px;width:30px;}
       .emctopmenurighttxt{float:left;color:#fff;padding-left:6px;padding-top:5px; text-align :center ;}
       .treerootbg{background: url(../images/leftmenubg.png);background-repeat:no-repeat;}
       #tvMenu a{color:#fff;}
    </style>
    <script type="text/javascript">

        function open_msn(uid, CnName) {
            ShowIframe('��ʱ��Ϣ', 'gtm/msn/msnlist.aspx?uid=' + uid + '&CnName=' + CnName, '600', '480');
        }

        function help() {
            window.open('../help/emc/help.aspx?HelpID=help.welcome', '����', '');

        }
        function changecompany() {
            ShowIframe('�л���˾', 'changecompany.aspx', '390', '210');
        }
        function open_online() {
            ShowIframe('������Ա', 'gtm/msn/userlist.aspx', '216', '503');
        }

        function GetTop1Msn() {//��ҳ�����½���Ϣ������ʾ

            var objmsg = document.getElementById("message");

            if ((objmsg == null)) {//&& (objmsg .style.display=="none")
                SfSoft.web.emc._default.GetTop1Msn(get_Msn_Result_CallBack);  
            }
            if (StartTimerMsn == "1") {
                setTimeout("GetTop1Msn()", timerMsn);
            }
        }

        function updatepassword() {

            ShowIframe('�����޸�', 'updatepassd.aspx', '300', '220');
        }
        function GetMsg() {
            var objmsg = document.getElementById("message");

            if ((objmsg == null)) {
                $.messager.show(0, '������Ϣ��', 1000);
            }
        }

        function get_Msn_Result_CallBack(response) {
            if (response.value != null) {

                var ds = response.value;
                var tbl = ds.Tables[0];
                var content = "";
                var ids = "";
                if (tbl.Rows.length > 0) {
                    for (var i = 0; i < tbl.Rows.length; i++) {
                        var uid = tbl.Rows[i].UID;
                        var name = tbl.Rows[i].Name;
                        var msnid = tbl.Rows[i].ID;
                        var msn = tbl.Rows[i].Msn;
                        var SendTime = tbl.Rows[i].SendTime;
                        ids = ids + msnid + ",";
                        SendTime = formatDate(SendTime);
                        var url = "\"javascript:open_msn('" + uid + "', '" + name + "')\"";
                        content = content + "<div  id='msgcontent" + msnid + "'>������" + name + "  ��Ϣʱ�䣺" + SendTime + "&nbsp;<img src='/images/icon/bullet_cross.png' style='cursor:hand' title='�����Ϣ' onclick=ClearMsg('" + msnid + "') /><br>��Ϣ���ݣ�<a href=" + url + " >" + msn + "</a><hr width='99%'></div>";
                    }

                    $.messager.lays(310, 200);
                    $.messager.show('<font color=red>��Ϣ����</font><font color=blue>(<span id="spannum">' + tbl.Rows.length + '</span>)</font>&nbsp;<img src="/images/icon/bullet_cross.png" style="cursor:hand" title="�����Ϣ" onclick=ClearMsg("' + ids + '")   >', '' + content + '', 5000);
                }
            }
        }


        //ȡ���Ѳ��ĵ���Ϣ
        function ClearMsg(id) {
            SfSoft.web.emc._default.ClearMsn(id);
            var objnum = document.getElementById("spannum");
            var objdiv;
            if (id.indexOf(",") > 0) {
                objdiv = document.getElementById("message_content");
                objnum.innerText = "0";
            }
            else {

                objnum.innerText = parseInt(objnum.innerText) - 1;
                objdiv = document.getElementById("msgcontent" + id);
            }
            objdiv.innerText = "";
        }
        function formatDate(v) {
            if (typeof v == 'string') v = parseDate(v);
            if (v instanceof Date) {
                var y = v.getFullYear();
                var m = v.getMonth() + 1;
                var d = v.getDate();
                var h = v.getHours();
                var i = v.getMinutes();
                var s = v.getSeconds();
                var ms = v.getMilliseconds();
                if (ms > 0) return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s; //+ '.' + ms;   
                if (h > 0 || i > 0 || s > 0) return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
                return y + '-' + m + '-' + d;
            }
            return '';
        }


        function Run(strPath) {
            try {
                strPath = strPath.replace(" ", "%20")
                var objShell = new ActiveXObject("wscript.shell");
                objShell.Run(strPath);
                objShell = null;
            }
            catch (e) {
                alert('�Ҳ����ļ�' + strPath + '��û�����ñ�ϵͳΪ����վ��! ��ȷ��·�����ļ����Ƿ���ȷ;�����ȷ����������������ñ�ϵͳΪ����վ�㡣')
            }
        }   
 

    </script>
</head>
<body class="easyui-layout" style="overflow-y: hidden" scroll="no">

    <noscript>
        <div style="position: absolute; z-index: 100000; height: 2046px; top: 0px; left: 0px;
            width: 100%; background: white; text-align: center;">
            <img src="images/noscript.gif" alt='��Ǹ���뿪���ű�֧�֣�' />
        </div>
    </noscript>
    <div region="north" split="true" border="false" style="overflow: hidden; height: 83px;
        background: url(../images/topbg.png);background-repeat:  repeat-x;  ">
        <div style="padding-left: 0px; width: 100%; float: left;height:90px;">
            <div style="float: left; margin-left: 7px; margin-top: 0px; width: 450px; ">
                <img src="../images/toplogo.png"   />
            </div>
      <%--      <div runat="server" id="EMCLOGO"  style="float: left;margin-left: 140px; width: 435px; margin-top: 40px; font-weight: bold;
                color: #333735; font-size: 18px;">
            </div>--%>
            <div style="float: right; color: #fff; padding-right: 10px; font-weight: bold; padding-top: 10px;  
                width: 180px;  ">
               <asp:Label ID="lblCurDate" runat ="server" ></asp:Label></div>
        </div>
        <div style="float: left;width: 100%; background: url(../images/topmenubg.png);height:27px; display:none;">
            <div class="emctopmenu"><div class ="emctopmenuli"><span class="emctopmenuspan">&nbsp;</span>Эͬ�칫</div><%=GetUnSystem() %></div>
            <div class="emctopmenuright"><div class ="emctopmenurighticon" >&nbsp;</div><div class="emctopmenurighttxt"><asp:Label ID="lblCnName" runat="server" ></asp:Label>  </div></div>
            
        </div>
    </div>
    <div region="west" hide="true" split="true" title="<%=westTitle %>" " border="false" style="width: 160px;"
        id="west">
        <div id="nav" class="easyui-accordion" fit="true" border="false" style="overflow: auto;
            background-color: #3083ED; ">
            <!--  �������� -->
            <%=strMenus %>
            <div style="display: <%=strDispNav%>">
                <form id="form1" runat="server">
                <asp:TreeView ID="tvMenu" runat="server"    ExpandDepth="1" Width="130px" Visible="false">
                </asp:TreeView>
                </form>
            </div>
        </div>
    </div>
    <div id="mainPanle" region="center" style="background: #eee; overflow-y: hidden;">
        <div id="tabs" class="easyui-tabs" fit="true" border="false">
        </div>
    </div>
    <div region="south" split="false" border="false" style="height: 25px;overflow:hidden ; background: #D2E0F2;background: url(../images/homebtnbg.png);">
        <div class="footer">
            <div style="float: left; padding-left:10px;padding-top:5px;width: 300px; font-family: ΢���ź�; color: #fff"
                id="spanUserInfo" runat="server"></div><div style="float: right; overflow: hidden;">
                    <table border="0" cellpadding="0" cellspacing="0" class="FootTools">
                        <tr>
                            <td>
                                <img src="../images/icon/index_top_helpbuttom01.png" title="����" onclick="help()" class="cursor" />
                            </td>
                            <td>
                                <img src="../images/icon/goahead_on.gif" title="����" onclick="history.go(-1)" class="cursor" />
                            </td>
                            <td>
                                <img src="../images/icon/backoff_off.gif" title="ǰ��" onclick="history.go(1)" class="cursor" />
                            </td>
                            <td>
                                <img src="../images/ICON/renovate01.png" title="ˢ��" onclick="window.location.reload();"
                                    class="cursor" />
                            </td>
                            <td style="display: <%=strDisp%>">
                                <img src="../images/ICON/house_go.png" title="�л���˾" onclick="changecompany();" class="cursor" />
                            </td>
                            <td>
                                <img src="../images/ICON/lock_edit01.png" title="�޸�����" onclick="updatepassword();"
                                    class="cursor" />
                            </td>
                            <td>
                                <img src="../images/ICON/user_star01.png" title="������Ա" onclick="open_online();" class="cursor" />
                            </td>
                            <td style="display:none;">
                                <img src="../images/ICON/comment_dull01.png" title="��ʱ��Ϣ" onclick="open_msn('','')"
                                    class="cursor" />
                            </td>
                            <td>
                                <img src="../images/icon/mail01.png" title="��Ϣ����" onclick=" GetTop1Msn();" class="cursor" />
                            </td>
                            <td>
                                <img src="../images/icon/door_out01.png" title="�˳�" onclick="document.location='../login.aspx?loginout=out'"
                                    class="cursor" />
                            </td>
                        </tr>
                    </table>
                </div>
        </div>
    </div>
    <div id="mm" class="easyui-menu" style="width: 150px;">
        <div id="mm-tabupdate">
            ˢ��</div>
        <div class="menu-sep">
        </div>
        <div id="mm-tabclose">
            �ر�</div>
        <div id="mm-tabcloseother">
            ����֮��ȫ���ر�</div>
        <div class="menu-sep">
        </div>
        <div id="mm-tabcloseright">
            ��ǰҳ�Ҳ�ȫ���ر�</div>
        <div id="mm-tabcloseleft">
            ��ǰҳ���ȫ���ر�</div>
        <div class="menu-sep">
        </div>
        <div id="mm-exit">
            �˳�</div>
    </div>
    <script type="text/javascript">
        var StartTimerMsn = "<%=StartTimerMsn %>";
        var timerMsn = parseInt("<%=timerMsn%>");

        GetTop1Msn();
    </script>
</body>
</html>
