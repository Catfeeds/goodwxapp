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
namespace SfSoft.web.emc.wxcourse.bagset
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
            hfMID.Value = "emc.wxcourse.bagset";
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
            BLL.WX_Course_SetBag bll = new BLL.WX_Course_SetBag();
            string[] arrID = ID.Split(',');
            for (int i = 0; i < arrID.Length; i++)
            {
                int id = Common.Common.stringToInt(arrID[i].ToString());
                Model.WX_Course_SetBag modelMsn = bll.GetModel(id);
                modelMsn.IsAct = 0;
                bll.Update(modelMsn);
            }
            BindData(GetWhere());
        }
        private void BindData(string strWhere)
        {
            BLL.WX_Course_SetBag bll = new BLL.WX_Course_SetBag();
            DataSet ds = bll.GetList("IsAct=1");

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
            string strWhere = "1=1 and IsAct=1";
            if (txtBagName.Text != "") {
                strWhere += " and BagName='%" + txtBagName.Text + "%'";
            }
            if (ddlMediaType.SelectedItem != null && ddlMediaType.SelectedValue != "")
            {
                strWhere += " and MediaType=" + ddlMediaType.SelectedValue;
            }
            strWhere += " order by Id desc";
            return strWhere;
        }

        protected void btnSearch_Click(object sender, EventArgs e)
        {
            BindData(GetWhere());
        }
        protected new void GridView1_RowDataBound(object sender, GridViewRowEventArgs e)
        {
            if (e.Row.RowType == DataControlRowType.DataRow) {
                string idex = GridView1.DataKeys[e.Row.RowIndex].Value.ToString();
                string url = "update.aspx?ID=" + idex + "&mode=update";
                string name = e.Row.Cells[2].Text;
                e.Row.Cells[2].Text = "<a href='" + url + "'><font color=#2828FF>" + name + "</font></a>";
            }
        }
        
        protected void AspNetPager1_PageChanged(object sender, EventArgs e)
        {
            BindData(GetWhere());
        }
    }
}

