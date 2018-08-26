﻿using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using SfSoft.Common;
using SfSoft.DBUtility;
using SfSoft.SfEmc;
using System.Collections.Generic;
using System.Linq;
using System.IO;

namespace SfSoft.web.emc.wxcourse.card
{
    public partial class list : SfSoft.SfEmc.EmcBasePage
    {

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string ClassID = Request.Params["ClassID"].Trim();
                string mediaType = Request.Params["mediaType"].Trim();
                hfMediaType.Value = mediaType;
                hfClassID.Value = ClassID;
                BindData(GetWhere());

                InitDropDownList();
            }
            
            SetTabName(hfClassID.Value);
        }

        //1.初始化模块ID
        protected override void VtInitMID()
        {
            hfMID.Value = "emc.wxcourse.card";
        }
        protected override void VtPageAccess()
        {
            CheckPageAccess("emc.wxcourse.card.browse");
        }
        
        private void SetTabName(string code)
        {
            /*
            BLL.WX_Course_SetBag bllBdc = new BLL.WX_Course_SetBag();
            DataSet ds = bllBdc.GetList("id=" + code + "");
            string tabname = "学习卡";
            if (ds != null && ds.Tables[0]!=null && ds.Tables[0].Rows.Count>0)
            {
                tabname = "[" + ds.Tables[0].Rows[0].Field<string>("BagName") + "]" + tabname;
            }
            TabOptionItem1.Tab_Name = tabname;
             * */
            TabOptionItem1.Tab_Name = "父母特训营";
        }

        private void BindData(string strWhere)
        {
            BLL.WX_Course_Card bll = new BLL.WX_Course_Card();
            DataSet ds= bll.GetList(strWhere);

            GridView1.DataSource = ds;
            GridView1.DataBind();
        }

        private string GetWhere()
        {
            return " BagId='" + hfClassID.Value + "' and IsAct=1";
        }
        //删除
        protected void GridView1_RowDeleting(object sender, GridViewDeleteEventArgs e)
        {

            BLL.WX_Course_Card bll = new BLL.WX_Course_Card();
            string cardId= GridView1.DataKeys[e.RowIndex].Values[0].ToString();
            var model= bll.GetModel(Convert.ToInt32(cardId));
            model.IsAct = 0;
            bll.Update(model);
            BindData(GetWhere());
        }
        private void UpdateCourseBag(string mode,int courseId)
        {
            try
            {
                BLL.WX_Course bll = new BLL.WX_Course();
                var model = bll.GetModel(courseId);
                if (mode == "add")
                {
                    model.IsBags = 1;
                    bll.Update(model);
                }
                else if (mode == "del")
                {
                    model.IsBags = 0;
                    bll.Update(model);
                }
            }
            catch (Exception ex) { 
            
            }
        }
        protected void btnAdd_Click(object sender, EventArgs e)
        {
            
        }
        protected void GridView1_RowDataBound(object sender, GridViewRowEventArgs e)
        {
            if (e.Row.RowType == DataControlRowType.DataRow)
            {
                var index = GridView1.DataKeys[e.Row.RowIndex].Value.ToString();
                //string url = "update.aspx?ID=" + index + "&mode=update";
                var tip = e.Row.Cells[0].Text;
                //e.Row.Cells[0].Text = "<a href='" + url + "'><font color=#2828FF>" + e.Row.Cells[0].Text + "</font></a>";
                e.Row.Cells[0].Attributes.Add("onclick", "toggle(" + index + ")");
                e.Row.Cells[0].Text = "<font color=#2828FF>" + e.Row.Cells[0].Text + "</font>";
                if (e.Row.RowState == DataControlRowState.Normal || e.Row.RowState == DataControlRowState.Alternate)
                {
                    ((LinkButton)e.Row.Cells[5].Controls[0]).Attributes.Add("onclick", "javascript:return confirm('你确认要删除：\"" + tip + "\"吗?')");
                    ((LinkButton)e.Row.Cells[6].Controls[0]).Attributes.Add("onclick", "myPrompt("+index+")");
                    ((LinkButton)e.Row.Cells[6].Controls[0]).Attributes.Add("href", "javascript:void(0)");
                }
            }
        }
        protected void GridView2_RowDataBound(object sender, GridViewRowEventArgs e)
        {
        
        }
        private Boolean CheckCodes(string sectionId)
        {
            BLL.WX_Course_Section bllbd = new BLL.WX_Course_Section();
            string strWhere = " SectionId = '" + sectionId + "' and ClassifyId='" + hfClassID.Value + "'";
            DataSet dsbd = bllbd.GetList(strWhere);
            if (dsbd.Tables[0].Rows.Count > 0)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        private void InitDropDownList()
        {
            BLL.WX_Course_Card bll = new BLL.WX_Course_Card();
            var list= bll.GetModelList("IsAct=1");
            foreach (var m in list) {
                ddlCourseCardType.Items.Add(new ListItem() { 
                    Value=m.Id.ToString(),
                    Text=m.Title
                });
            }
        }
        private void SetModel()
        { 
            
        }
        private void ClearData()
        { 
            
        }
        protected void btnDelPic_Click(object sender, EventArgs e)
        {

        }
        private string GetDownWhere()
        {
            string strWhere = "1=1 and isnull(Url,'')<>'' ";
            if (ddlCourseCardType.SelectedItem != null && ddlCourseCardType.SelectedValue != "")
            {
                strWhere += " and CardId=" + ddlCourseCardType.SelectedValue;
            }
            string firstDate = "2010-10-10";
            string secondDate = "2099-10-10";
            if (!string.IsNullOrEmpty(txtFirstDate.Text))
            {
                firstDate = txtFirstDate.Text;
            }
            if (!string.IsNullOrEmpty(txtSecondDate.Text))
            {
                secondDate = txtSecondDate.Text;
            }
            strWhere += " and CreateDate between '" + firstDate + "' and '" + secondDate + "'";
            if (cblActive.SelectedItem != null && cblActive.SelectedValue != "")
            {
                strWhere += " and isnull(IsUsing,0)=" + cblActive.SelectedValue;
            }
            return strWhere;
        }
        protected void btnSearch_Click(object sender, EventArgs e)
        {
            BindCardDetailData();
        }
        private void BindCardDetailData()
        {
            BLL.WX_Course_Card_Detail detail = new BLL.WX_Course_Card_Detail();
            var listDetail = detail.GetModelList(GetDownWhere());

            BLL.WX_Course_Card card = new BLL.WX_Course_Card();
            var listCard = card.GetModelList("");

            var list = (from d in listDetail
                       join c in listCard on d.CardId equals c.Id
                       select new
                       {
                           Id = d.Id,
                           Title = c.Title,
                           CardId = c.Id,
                           StardDate = c.StartDate,
                           EndDate = c.EndDate,
                           IsUing = (d.IsUsing ?? 0) == 0 ? "未激活" : "激活",
                           RegistDate = d.RegistDate,
                           DownNumber = d.DownNumber ?? 0,
                           CreateDate = d.CreateDate,
                           CardNo = d.CardNo
                       }).ToList();

            if (list.Count() > 0) {
                PagedDataSource pds = new PagedDataSource();
                pds.DataSource = list;
                AspNetPager1.RecordCount = pds.Count;
                pds.AllowPaging = true;
                pds.CurrentPageIndex = AspNetPager1.CurrentPageIndex - 1;
                pds.PageSize = AspNetPager1.PageSize;
                GridView2.PageIndex = AspNetPager1.CurrentPageIndex - 1;
                this.GridView2.DataSource = pds;
                this.GridView2.DataBind();
            }
            else
            {
                AspNetPager1.RecordCount = 0;
                Common.SetEmptyGridView.GridViewDataBind(GridView2,list);
            }
        }
        protected void btnDown_Click(object sender, EventArgs e)
        {
            Manage.Zip.ZipFileHelper helper = new Manage.Zip.ZipFileHelper();
            BLL.WX_Course_Card_Detail bll = new BLL.WX_Course_Card_Detail();
            var list = bll.GetModelList(GetDownWhere());
            var files = new List<string>();
            var ids = new List<int>();
            foreach (var m in list) {
                files.Add(MapPath(m.QRPath));
                ids.Add(m.Id);
            }
            var buffer=helper.ZipFileByCode(files);

            string name = "父母特训营激活码("+string.Format("{0:yyyyMMdd}", DateTime.Now)+").zip";
            Response.AddHeader("content-disposition", "attachment;filename="+name);
            Response.BinaryWrite(buffer);
            Response.Flush();
            

            Action<List<Model.WX_Course_Card_Detail>> action = (x) =>
            {
                UpdateLearnCard(x);
            };
            action.BeginInvoke(list, null, null);

            Response.End();
        }

        protected void GridView2_RowDataBound1(object sender, GridViewRowEventArgs e)
        {

        }

        protected void GridView2_RowCommand(object sender, GridViewCommandEventArgs e)
        {
            var id = Convert.ToInt32(e.CommandArgument);
            BLL.WX_Course_Card_Detail bll=new BLL.WX_Course_Card_Detail();
            var model = bll.GetModel(id);

            QRCode qr = new QRCode((model.CardId??0).ToString());

            var subFolder = string.Format("{0:yyyyMMdd}", DateTime.Now);
            var path = Server.MapPath("\\Files\\QR\\"+ subFolder+"\\");
            if (!Directory.Exists(path)) {
                Directory.CreateDirectory(path);
            }
            
            var fileName = path + model.CardId+".png";

            var result= qr.WriteBarcode(model.Url, fileName, model.CardNo);
            Manage.Common.CommonFile file = new Manage.Common.CommonFile();
            
            var buffer= file.ReadCommonFile(fileName);
            string name = "父母特训营激活码(" + model.CardNo + ").png";
            Response.AddHeader("content-disposition", "attachment;filename=" + name);
            Response.BinaryWrite(buffer);
            Response.Flush();

            Action<Model.WX_Course_Card_Detail> action = (x) =>
            {
                UpdateLearnCard(x);
            };
            action.BeginInvoke(model, null, null);

            Response.End();
        }
        private void UpdateLearnCard(List<Model.WX_Course_Card_Detail> list)
        {
            BLL.WX_Course_Card_Detail bll = new BLL.WX_Course_Card_Detail();
            foreach (var m in list)
            {
                m.DownNumber = (m.DownNumber ?? 0)+1;
                bll.Update(m);
            }
        }
        private void UpdateLearnCard(Model.WX_Course_Card_Detail model)
        {
            BLL.WX_Course_Card_Detail bll = new BLL.WX_Course_Card_Detail();
            model.DownNumber = (model.DownNumber ?? 0) + 1;
            bll.Update(model);
        }
        protected void AspNetPager1_PageChanged(object sender, EventArgs e)
        {
            BindCardDetailData();
        }
    }
}

