﻿<%@ Page Language="C#" MasterPageFile="~/MasterPage/PageTemplate.Master" AutoEventWireup="true"
    CodeBehind="browse.aspx.cs" Inherits="SfSoft.web.emc.material.reply.browse" Title="无标题页" %>

<asp:Content ID="Content1" ContentPlaceHolderID="PageBody" runat="server">
    <cc1:TabOptionWebControls ID="TabOptionWebControls1" runat="server">
        <cc1:TabOptionItem ID="TabOptionItem1" runat="server" Tab_Name="关键字回复">
            <table class="fromtable">
                <tr>
                    <td>关键字</td>
                    <td><asp:TextBox ID="txtKeyWord" runat="server"></asp:TextBox></td>
                    <td>消息类型</td>
                    <td><asp:DropDownList ID="ddlMsgType" runat="server"></asp:DropDownList></td>
                    <td>标题</td>
                    <td><asp:TextBox ID="txtTitle" runat="server"></asp:TextBox></td>

                    <td>微信号</td>
                    <td>
                        <asp:DropDownList ID="ddlApp"  runat="server" >
                                <asp:ListItem Text="" Value=""></asp:ListItem>
                                <asp:ListItem Text="家教智慧公众号(jiajiaozh)" Value="jiajiaozh"></asp:ListItem>
                                <asp:ListItem Text="品格养成服务号(pingeyc)" Value="pingeyc"></asp:ListItem>
                            </asp:DropDownList>
                    </td>

                    <td><asp:Button ID="btnSearch" runat="server" Text="查询" class="btn" 
                            onmouseout="this.className='btn'"  onmouseover="this.className='btn_mouseover'" 
                            onclick="btnSearch_Click1" /></td>
                </tr>
             </table>
            <asp:SmartGridView ID="GridView1" runat="server"  AutoGenerateColumns="False"
                Width="99%"  DataKeyNames="ID"
                 OnRowDataBound="GridView1_RowDataBound" MouseOverCssClass="OverRow" 
                SkinID="sgv1" onrowcancelingedit="GridView1_RowCancelingEdit" 
                onrowediting="GridView1_RowEditing" onrowupdating="GridView1_RowUpdating">
                <Columns>
                    <asp:TemplateField ItemStyle-Width="20px">
                        <HeaderTemplate>
                            <asp:CheckBox ID="all" runat="server" />
                        </HeaderTemplate>
                        <ItemTemplate>
                            <asp:CheckBox ID="item" runat="server" />
                        </ItemTemplate>
                    </asp:TemplateField>
                    <asp:BoundField DataField="ID" HeaderText="编号" ItemStyle-Width="60px" ReadOnly="true"  />
                    <asp:BoundField DataField="KeyWord" HeaderText="关键字" ItemStyle-Width="100px" ReadOnly="true"   />
                    <asp:BoundField DataField="Title" HeaderText="标题"  ReadOnly="true"  ItemStyle-Width="400px"  />
                    <asp:BoundField DataField="MsgTypeText" HeaderText="消息类型" ItemStyle-Width="100px"  ReadOnly="true"  />
                    
                    <asp:TemplateField HeaderText="标签" >
                        <ItemTemplate>
                            <asp:Label ID="lbTags" runat="server" Text='<%#Eval("Tags") %>'></asp:Label>
                        </ItemTemplate>
                        <HeaderStyle HorizontalAlign="Center" />
                        <ItemStyle HorizontalAlign="Center" />
                        <EditItemTemplate>
                            <asp:TextBox ID="txtTags" Width="99%" runat="server" Text='<%#Eval("Tags") %>'></asp:TextBox>
                        </EditItemTemplate>
                    </asp:TemplateField>

                    <asp:TemplateField HeaderText="排序" ItemStyle-Width="80px">
                        <ItemTemplate>
                            <asp:Label ID="lbOrder" runat="server" Text='<%#Eval("Order") %>'></asp:Label>
                        </ItemTemplate>
                        <HeaderStyle HorizontalAlign="Center" />
                        <ItemStyle HorizontalAlign="Center" />
                        <EditItemTemplate>
                            <asp:TextBox ID="txtOrder" runat="server" Text='<%#Eval("Order") %>'></asp:TextBox>
                        </EditItemTemplate>
                    </asp:TemplateField>

                    <asp:CommandField ShowEditButton="True" HeaderText="操作" EditText="编辑" >
                            <ItemStyle Width="70px" HorizontalAlign="Center" />
                            <HeaderStyle  HorizontalAlign="Center"/>
                      </asp:CommandField>
                </Columns>
                <PagerSettings Position="Bottom"></PagerSettings>
            </asp:SmartGridView>
        </cc1:TabOptionItem>
    </cc1:TabOptionWebControls>
    <asp:AspNetPager ID="AspNetPager1" runat="server" class="aspnetpager" 
                        CustomInfoHTML="&lt;font color='red'&gt;&lt;b&gt;%currentPageIndex%&lt;/b&gt;&lt;/font&gt;/%PageCount%&nbsp; &nbsp;&nbsp;   共 %RecordCount% 记录   每页 %PageSize% 条" 
                        FirstPageText="首 页" LastPageText="尾 页" NextPageText="下一页" 
                        OnPageChanged="AspNetPager1_PageChanged" PageSize="15" PrevPageText="上一页" 
                        ShowCustomInfoSection="right" ShowDisabledButtons="false" 
                        ShowPageIndexBox="always">
                    </asp:AspNetPager>
</asp:Content>