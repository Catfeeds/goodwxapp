﻿<%@ Page Language="C#" MasterPageFile="~/MasterPage/FrameTemplate.Master" AutoEventWireup="true" CodeBehind="wangmama.aspx.cs" Inherits="SfSoft.web.emc.gardenia.task.wangmama" %>

<asp:Content ID="Content1" ContentPlaceHolderID="PageBody" runat="server">
    <cc1:TabOptionWebControls ID="TabOptionWebControls1" runat="server">
        <cc1:TabOptionItem ID="TabOptionItem1" runat="server" Tab_Name="每周一课">
            
            <asp:Panel ID="Panel1" GroupingText="基础条件" runat="server">
                <style>
                    .select{ width:95%;}
                </style>
                
                <table border="0" cellpadding="2" cellspacing="0" width="100%" class="fromtable">
                    <tr>
                        <td>
                            <asp:TextBox ID="txtCourseName"  runat="server"></asp:TextBox>
                        </td>
                        <td>
                            <asp:Button ID="btnAddTask"  class="btn" 
                            onmouseout="this.className='btn'" onmouseover="this.className='btn_mouseover'"  runat="server" Text="添加任务" OnClick="btnAddTask_Click" />
                        </td>
                    </tr>
                </table>
            </asp:Panel>
            <asp:Panel ID="Panel2" GroupingText="" runat="server">
                
                <asp:SmartGridView ID="GridView1" runat="server"  AutoGenerateColumns="False"
                    Width="99%"  DataKeyNames="Id"  MouseOverCssClass="OverRow" 
                    SkinID="sgv1" >
                    <Columns>
                        <asp:TemplateField ItemStyle-Width="20px">
                            <HeaderTemplate>
                                <asp:CheckBox ID="all" runat="server" />
                            </HeaderTemplate>
                            <ItemTemplate>
                                <asp:CheckBox ID="item" runat="server" />
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="Id" HeaderText="编号" ReadOnly="true" />
                        <asp:BoundField DataField="Name" HeaderText="名称" ReadOnly="true" />
                    </Columns>
                    <CascadeCheckboxes>
                        <asp:CascadeCheckbox ChildCheckboxID="item" ParentCheckboxID="all" />
                    </CascadeCheckboxes>
                    <CheckedRowCssClass CheckBoxID="item" CssClass="SelectedRow" />
                    <PagerSettings Position="Bottom"></PagerSettings>
                </asp:SmartGridView>
            </asp:Panel>
            <asp:AspNetPager ID="AspNetPager1" runat="server" class="aspnetpager" 
                        CustomInfoHTML="&lt;font color='red'&gt;&lt;b&gt;%currentPageIndex%&lt;/b&gt;&lt;/font&gt;/%PageCount%&nbsp; &nbsp;&nbsp;   共 %RecordCount% 记录   每页 %PageSize% 条" 
                        FirstPageText="首 页" LastPageText="尾 页" NextPageText="下一页" 
                        OnPageChanged="AspNetPager1_PageChanged" PageSize="50" PrevPageText="上一页" 
                        ShowCustomInfoSection="right" ShowDisabledButtons="false" 
                        ShowPageIndexBox="always">
                    </asp:AspNetPager>
        </cc1:TabOptionItem>
        <cc1:TabOptionItem ID="TabOptionItem2" runat="server" Tab_Name="每周一课任务编排">
            <asp:Panel ID="Panel4" GroupingText="" runat="server">
                <script src="../../../js/My97DatePicker/WdatePicker.js"></script>
                <asp:SmartGridView ID="GridView3" runat="server"  AutoGenerateColumns="False"
                    Width="99%"  DataKeyNames="Id"  MouseOverCssClass="OverRow" 
                    SkinID="sgv1"  OnRowDataBound="GridView3_RowDataBound" 
                    OnRowCancelingEdit="GridView3_RowCancelingEdit" 
                    OnRowDeleting="GridView3_RowDeleting" 
                    OnRowEditing="GridView3_RowEditing" OnRowUpdating="GridView3_RowUpdating" >
                    <Columns>
                        <asp:TemplateField ItemStyle-Width="20px">
                            <HeaderTemplate>
                                <asp:CheckBox ID="CheckBox1" runat="server" />
                            </HeaderTemplate>
                            <ItemTemplate>
                                <asp:CheckBox ID="CheckBox2" runat="server" />
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="Id" HeaderText="编号" ReadOnly="true" />
                        <asp:BoundField DataField="Name" HeaderText="名称" ReadOnly="true" />
                        <asp:TemplateField HeaderText="启用日期">
                            <ItemTemplate><%# Eval("StartUpDate") %></ItemTemplate>
                            <EditItemTemplate>
                                <asp:TextBox ID="txtStartUpDate" onfocus="WdatePicker()" runat="server" Text='<%#Eval("StartUpDate") %>'></asp:TextBox>
                            </EditItemTemplate>
                        </asp:TemplateField>
                        <asp:CommandField ShowEditButton="true" ShowCancelButton="true" ShowDeleteButton="true" />
                    </Columns>
                    <CascadeCheckboxes>
                        <asp:CascadeCheckbox ChildCheckboxID="item" ParentCheckboxID="all" />
                    </CascadeCheckboxes>
                    <CheckedRowCssClass CheckBoxID="item" CssClass="SelectedRow" />
                    <PagerSettings Position="Bottom"></PagerSettings>
                </asp:SmartGridView>
            </asp:Panel>
            <asp:AspNetPager ID="AspNetPager3" runat="server" class="aspnetpager" 
                        CustomInfoHTML="&lt;font color='red'&gt;&lt;b&gt;%currentPageIndex%&lt;/b&gt;&lt;/font&gt;/%PageCount%&nbsp; &nbsp;&nbsp;   共 %RecordCount% 记录   每页 %PageSize% 条" 
                        FirstPageText="首 页" LastPageText="尾 页" NextPageText="下一页" 
                        OnPageChanged="AspNetPager3_PageChanged" PageSize="50" PrevPageText="上一页" 
                        ShowCustomInfoSection="right" ShowDisabledButtons="false" 
                        ShowPageIndexBox="always">
                    </asp:AspNetPager>
        </cc1:TabOptionItem>
    </cc1:TabOptionWebControls>
</asp:Content>