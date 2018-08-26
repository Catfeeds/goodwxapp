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
using SfSoft.SfEmc;
using System.Collections.Generic;
namespace SfSoft.web.emc.expert.teacher
{
    public partial class browse : SfSoft.SfEmc.EmcBrowseBasePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                BindData(GetWhere());
            }
            else
            {
                Common.SetEmptyGridView.ResetGridView(this.GridView1);
            }
        }
        //1.初始化模块ID
        protected override void VtInitMID()
        {
            hfMID.Value = "emc.expert.teacher";
        }
        #region 初始化工具栏
        protected override void VtInitToolbars()
        {
            NewTsbtnNew();
            phToolBars.Controls.Add(tsbtnNew);
            NewTsbtnDelete();
            phToolBars.Controls.Add(tsbtnDelete);
        }

        protected override void VtInitBaseToolsBars()
        {
            VtInitBaseListToolsBars();
        }
        #endregion
        protected override void VtDelete()
        {
            string ID = EmcCommon.GetCheckedDataKey(GridView1, 0, true);
            if (ID == "")
            {
                return;
            }
            BLL.WX_JJZH_Expert bll = new BLL.WX_JJZH_Expert();
            string[] arrID = ID.Split(',');
            for (int i = 0; i < arrID.Length; i++)
            {
                int id = Common.Common.stringToInt(arrID[i].ToString());
                Model.WX_JJZH_Expert modelMsn = bll.GetModel(id);
                modelMsn.IsAct = 0;
                bll.Delete(id);
            }
            BindData(GetWhere());
        }
        private void BindData(string strWhere)
        {
            BLL.WX_JJZH_Expert bll = new BLL.WX_JJZH_Expert();

            DataSet ds = bll.GetList(strWhere);
            
            if (ds != null && ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
            {
                PagedDataSource pds = new PagedDataSource();
                pds.DataSource = ds.Tables[0].DefaultView;
                AspNetPager1.RecordCount = pds.Count;
                pds.AllowPaging = true;
                pds.CurrentPageIndex = AspNetPager1.CurrentPageIndex - 1;
                pds.PageSize = AspNetPager1.PageSize;
                GridView1.PageIndex = AspNetPager1.CurrentPageIndex - 1;
                this.GridView1.DataSource = pds;
                this.GridView1.DataBind();
            }
            else
            {
                AspNetPager1.RecordCount = 0;
                Common.SetEmptyGridView.GridViewDataBind(GridView1, ds.Tables[0]);
            }
        }
        protected void GridView1_PageIndexChanging(Object sender, GridViewPageEventArgs e)
        {
            GridView1.PageIndex = e.NewPageIndex;
            BindData(GetWhere());
        }
        private string GetWhere()
        {
            string strWhere = "1=1";
            if (txtUName.Text.Trim() != "") {
                strWhere += " and UName like '%"+txtUName.Text+"%'";
            }
            if (txtNickName.Text.Trim() != "") {
                strWhere += " and NickName like '%"+txtNickName.Text+"%'";
            }
            //if (cbIsDefault.Checked == true) {
            //    strWhere += " and IsDefault=1";
            //}
            if (cbIsSystem.Checked == true) {
                strWhere += " and ExpertType=1";
            }
            if (cbIsCommon.Checked == true)
            {
                strWhere += " and ExpertType=2";
            }
            if (cbIsAct.Checked == true)
            {
                strWhere += " and IsAct=0";
            }
            else {
                strWhere += " and IsAct=1";
            }
            strWhere += " order by sn, Id ";
            return strWhere;
        }

        protected void btnSearch_Click(object sender, EventArgs e)
        {
            BindData(GetWhere());
        }
        protected new void GridView1_RowDataBound(object sender, GridViewRowEventArgs e)
        {
            if (e.Row.RowType == DataControlRowType.DataRow)
            {
                string url = "update.aspx?ID=" + e.Row.Cells[1].Text + "&mode=update";
                string name =e.Row.Cells[2].Text;
                e.Row.Cells[2].Text = "<a href='" + url + "'><font color=#2828FF>" + name + "</font></a>";
            }
        }
        protected void AspNetPager1_PageChanged(object sender, EventArgs e)
        {
            BindData(GetWhere());
        }

        protected void btnFind_Click(object sender, EventArgs e)
        {
            BindData(GetWhere());
        }
        public string GetExpertType(string type)
        {
            string result = "";
            if (type == "1") {
                result = "系统专家";
            }
            else if (type == "2") {
                result = "普通专家";
            }
            return result;
        }
    }
}

