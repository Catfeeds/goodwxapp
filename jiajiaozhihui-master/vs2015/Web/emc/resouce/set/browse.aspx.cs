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

namespace SfSoft.web.emc.resouce.set
{
    public partial class browse : SfSoft.SfEmc.EmcBasePage
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        //1.初始化模块ID
        protected override void VtInitMID()
        {
            hfMID.Value = "emc.sm.s7";
        }
        protected override void VtPageAccess()
        {
            CheckPageAccess("emc.sm.s7.browse");
        }
        protected override void VtInitBaseToolsBars()
        {
            VtInitBaseListToolsBars();
        }
    }
}

