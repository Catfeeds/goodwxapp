﻿<%@ Page Language="C#" MasterPageFile="~/MasterPage/PageTemplate.Master" AutoEventWireup="true" CodeBehind="browse.aspx.cs" Inherits="SfSoft.web.emc.brainsexpert.libraryadvset.browse" Title="无标题页" %>
 
<asp:Content ID="Content1" ContentPlaceHolderID="PageBody" runat="server">
    <cc1:TabOptionWebControls ID="TabOptionWebControls1" runat="server">
        <cc1:TabOptionItem ID="TabOptionItem1" runat="server" Tab_Name="">
            <asp:Panel ID="Panel1" GroupingText="筛选题库" runat="server">
                <div class="row">
                    <asp:CheckBoxList ID="cblMainLibrary" AutoPostBack="true" RepeatDirection="Horizontal" runat="server" 
                        onselectedindexchanged="cblMainLibrary_SelectedIndexChanged"></asp:CheckBoxList>
                </div>
                <div class="row">
                    <asp:CheckBoxList ID="cblQuestionType" AutoPostBack="true" RepeatDirection="Horizontal" 
                        RepeatLayout="Flow" runat="server" 
                        onselectedindexchanged="cblQuestionType_SelectedIndexChanged"></asp:CheckBoxList>
                </div>
                <div class="row">
                    <asp:CheckBoxList ID="cblGrade" AutoPostBack="true" RepeatDirection="Horizontal" 
                        RepeatLayout="Flow" runat="server" 
                        onselectedindexchanged="cblGrade_SelectedIndexChanged"></asp:CheckBoxList>
                </div>
                <div class="row">
                    <asp:CheckBoxList ID="cblDetailLibrary" AutoPostBack="true" RepeatDirection="Horizontal" 
                        RepeatLayout="Flow" runat="server" 
                        onselectedindexchanged="cblDetailLibrary_SelectedIndexChanged"></asp:CheckBoxList>
                </div>
            </asp:Panel>
            
            <asp:Panel ID="Panel3" GroupingText="库题明细" runat="server">          
                <asp:SmartGridView ID="GridView1" runat="server"  AutoGenerateColumns="False"
                    Width="99%"  DataKeyNames="ID" MouseOverCssClass="OverRow"  SkinID="sgv1" 
                    onrowdatabound="GridView1_RowDataBound" >
                    <Columns>
                        <asp:TemplateField ItemStyle-Width="20px" HeaderStyle-Width="20px">
                            <HeaderTemplate>
                                <asp:CheckBox ID="all" runat="server" />
                            </HeaderTemplate>
                            <ItemTemplate>
                                <asp:CheckBox ID="item" runat="server" />
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="ID" HeaderText="编号" ReadOnly="true" ItemStyle-Width="50px" HeaderStyle-Width="50px" />
                        <asp:BoundField DataField="TestQuestion" HeaderText="试题" ReadOnly="true" HeaderStyle-HorizontalAlign="Center"  ItemStyle-Width="300px" HeaderStyle-Width="300px" />
                        <asp:TemplateField HeaderText="答案"  HeaderStyle-HorizontalAlign="Center" ItemStyle-CssClass="" >
                            <ItemTemplate>
                                <label title="<%# "A："+ Eval("Answer1").ToString().Replace("/a","") +" B："+ Eval("Answer2").ToString().Replace("/b","") +" C："+ Eval("Answer3").ToString().Replace("/c","") +" D："+ Eval("Answer4").ToString().Replace("/d","") %>"><%# "A：" + Eval("Answer1").ToString().Replace("/a", "") + " B：" + Eval("Answer2").ToString().Replace("/b", "") + " C：" + Eval("Answer3").ToString().Replace("/c", "") + " D：" + Eval("Answer4").ToString().Replace("/d", "")%></label>
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="RightAnswer" HeaderText="正确答案"  ReadOnly="true" ItemStyle-Width="80px" HeaderStyle-Width="80px" HeaderStyle-HorizontalAlign="Center" ItemStyle-HorizontalAlign="Center" />
                        <asp:BoundField DataField="QuestionType" HeaderText="题库类型"  ReadOnly="true" ItemStyle-Width="100px" HeaderStyle-Width="100px" HeaderStyle-HorizontalAlign="Center" ItemStyle-HorizontalAlign="Center"  />
                        <asp:BoundField DataField="ClassID" HeaderText="题库分类"  ReadOnly="true" ItemStyle-Width="120px" HeaderStyle-Width="120px" HeaderStyle-HorizontalAlign="Center" ItemStyle-HorizontalAlign="Center"  />
                        <asp:BoundField DataField="Grade" HeaderText="容易度"  ReadOnly="true" ItemStyle-Width="100px" HeaderStyle-Width="100px" HeaderStyle-HorizontalAlign="Center" ItemStyle-HorizontalAlign="Center"  />
                        <asp:BoundField DataField="CreateDate" HeaderText="创建日期" DataFormatString="{0:yyyy-MM-dd}" ReadOnly="true" ItemStyle-Width="100px" HeaderStyle-Width="100px" HeaderStyle-HorizontalAlign="Center" ItemStyle-HorizontalAlign="Center"  />
                    
                    </Columns>
                    <CascadeCheckboxes>
                        <asp:CascadeCheckbox ChildCheckboxID="item" ParentCheckboxID="all" />
                    </CascadeCheckboxes>
                    <CheckedRowCssClass CheckBoxID="item" CssClass="SelectedRow" />
                    <PagerSettings Position="Bottom"></PagerSettings>
                </asp:SmartGridView>
                <asp:AspNetPager ID="AspNetPager1" runat="server" class="aspnetpager" 
                    CustomInfoHTML="&lt;font color='red'&gt;&lt;b&gt;%currentPageIndex%&lt;/b&gt;&lt;/font&gt;/%PageCount%&nbsp; &nbsp;&nbsp;   共 %RecordCount% 记录   每页 %PageSize% 条" 
                    FirstPageText="首 页" LastPageText="尾 页" NextPageText="下一页" 
                    OnPageChanged="AspNetPager1_PageChanged" PageSize="15" PrevPageText="上一页" 
                    ShowCustomInfoSection="right" ShowDisabledButtons="false" 
                    ShowPageIndexBox="always">
                </asp:AspNetPager>
            </asp:Panel>
            <asp:Panel ID="Panel2" GroupingText="导入新题库" runat="server">
                <table border="0" cellpadding="2" cellspacing="0" width="100%" class="fromtable">
                   <tr>
                         <td colspan="2">
                            <asp:DropDownList ID="ddlClass1" AutoPostBack="true" runat="server" 
                                 onselectedindexchanged="ddlClass1_SelectedIndexChanged"  ></asp:DropDownList>
                            <asp:DropDownList ID="ddlClass2"  runat="server"  ></asp:DropDownList>
                          </td>
                          <td>  
                            <asp:Button ID="btnInport" runat="server" Text="导入所选择的"   class="btn" 
                                  onclick="btnInport_Click" />
                        </td>
                   </tr>
                </table>
            </asp:Panel>
        </cc1:TabOptionItem>
    </cc1:TabOptionWebControls>
</asp:Content>