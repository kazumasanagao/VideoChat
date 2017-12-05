if ($(window).width() < 450 && document.getElementById("policycss")) {
    document.getElementById("policycss").href = "../stylesheets/policy_mob.css";
}

var policylanguage = "en";
var istermsand = true;

var policyHTML = '' +
'<div id="policy_container">' +
    '<div id="policy_title"><span id="termsand" onclick="termsand()">Terms and Conditions of Use</span><span id="privacypolicy" onclick="privacypolicy()">Privacy Policy</span><span id="japanese" onclick="japanese()">日本語</span></div>' +
    '<div id="policy_message">' +
    '</div>' +
    '<div class="applyboxes"><input id="applyage" type="checkbox" name="applyage" value="true" /><label class="applylabels" id="applyage_label" for="applyage">I am at least 18 years of age, or the age of majority in my province, territory or country.</label></div>' +
    '<div class="applyboxes"><input id="applypolicy" type="checkbox" name="applypolicy" value="true" /><label class="applylabels" id="applypolicy_label" for="applypolicy">I agree all of these documents.</label></div>' +
    '<div id="applyalerts">※ You need agree all above.</div>' +
    '<div id="applybuttonsflame"><span id="disagree_button" class="applybuttons" onclick="disagreepolicy()">Disagree</span><span id="agree_button" class="applybuttons" onclick="agreepolicy()">Agree</span></div>' +
'</div>';

function japanese() {
    if (policylanguage == "en") {
        policylanguage = "jp";
        $("#japanese").html("English");
        $("#termsand").html("利用規約");
        $("#privacypolicy").html("プライバシーポリシー");
    } else {
        policylanguage = "en";
        $("#japanese").html("日本語");
        $("#termsand").html("Terms and Conditions of Use");
        $("#privacypolicy").html("Privacy Policy");
    }
    if (istermsand) {
        termsand();
    } else {
        privacypolicy();
    }
}
function termsand() {
    istermsand = true;
    switch (policylanguage) {
        case "en":
            $('#policy_message').html(termsMessage);
            break;
        case "jp":
            $('#policy_message').html(termsMessageJP);
            break;
        default:
            $('#policy_message').html(termsMessage);
    }
    $('#termsand').css({"background":"white","color":"black", "cursor":"default"});
    $('#privacypolicy').css({"background":"black","color":"white","cursor":"pointer"});
}
function privacypolicy() {
    istermsand = false;
    switch (policylanguage) {
        case "en":
            $('#policy_message').html(policyMessage);
            break;
        case "jp":
            $('#policy_message').html(policyMessageJP);
            break;
        default:
            $('#policy_message').html(policyMessage);
    }
    $('#privacypolicy').css({"background":"white","color":"black", "cursor":"default"});
    $('#termsand').css({"background":"black","color":"white","cursor":"pointer"});
}

function agreepolicy() {
    var aa = $("[name=applyage]:checked").val();
    var ap = $("[name=applypolicy]:checked").val();
    if (aa == "true" && ap == "true") {
        $("#policy_container").remove();
        window.onbeforeunload = null;
        getSettings();
        goog_report_conversion();
    } else {
        $("#applyalerts").css({"visibility":"visible"});
    }
}
goog_snippet_vars = function() {
    var w = window;
    w.google_conversion_id = 939738334;
    w.google_conversion_label = "yZrSCKGwu2UQ3omNwAM";
    w.google_remarketing_only = false;
}
// DO NOT CHANGE THE CODE BELOW.
goog_report_conversion = function(url) {
    goog_snippet_vars();
    window.google_conversion_format = "3";
    var opt = new Object();
    opt.onload_callback = function() {
        if (typeof(url) != 'undefined') {
            window.location = url;
        }
    }
    var conv_handler = window['google_trackConversion'];
    if (typeof(conv_handler) == 'function') {
        conv_handler(opt);
    }
}

function disagreepolicy() {
    $.ajax({
        url: '/settings/delete',
        type: 'POST',
        success: function(data) {
            document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            location.href = "/";
        },
        data: {from:"policy"},
        dataType: 'json'
    });
}

var termsMessageJP = '' +
'<p>この規約（以下「本規約」といいます。）は、Chample株式会社（以下「当社」といいます。）が提供する Chample に関するすべての製品およびサービス（以下「本サービス」といいます。）の利用に関する条件を、本サービスを利用するお客様（以下「お客様」といいます。）と当社との間で定めるものです。</p>' +
'<p class="headlines">1. 定義</p>' +
'<p>本規約では、以下の用語を使用します。 </p>' +
'<p>1.1. 「コンテンツ」とは、文章、音声、音楽、画像、動画、ソフトウェア、プログラム、コードその他の情報のことをいいます。 </p>' +
'<p>1.2. 「本コンテンツ」とは、本サービスを通じてアクセスすることができるコンテンツのことをいいます。</p>' +
'<p>1.3. 「投稿コンテンツ」とは、お客様が本サービスに投稿、送信、アップロードしたコンテンツのことをいいます。 </p>' +
'<p>1.4. 「個別利用規約」とは、本サービスに関して、本規約とは別に「規約」、「ガイドライン」、「ポリシー」などの名称で当社が配布または掲示している文書のことをいいます。</p>' +
'<p class="headlines">2. 規約への同意</p>' +
'<p>2.1 お客様は、本規約の定めに従って本サービスを利用しなければなりません。お客様は、本規約に有効かつ取消不能な同意をしないかぎり本サービスを利用できません。 </p>' +
'<p>2.2. Champleサービスのメンバーとなるには18歳以上であるか、お客様の国または自治体における成年に達していなければなりません。 未成年者は成人の監督下でのみサービスを利用することができます。</p>' +
'<p>2.3. お客様は、本サービスを実際に利用することによって本規約に有効かつ取消不能な同意をしたものとみなされます。 </p>' +
'<p>2.4. 本サービスにおいて個別利用規約がある場合、お客様は、本規約のほか個別利用規約の定めにも従って本サービスを利用しなければなりません。</p>' +
'<p class="headlines">3. 規約の変更</p>' +
'<p>当社は、当社が必要と判断する場合、あらかじめお客様に通知することなく、いつでも、本規約および個別利用規約を変更できるものとします。変更後の本規約および個別利用規約は、当社が運営するウェブサイト内の適宜の場所に掲示された時点からその効力を生じるものとし、お客様は本規約および個別利用規約の変更後も本サービスを使い続けることにより、変更後の本規約および適用のある個別利用規約に対する有効かつ取消不能な同意をしたものとみなされます。かかる変更の内容をお客様に個別に通知することはいたしかねますので、本サービスをご利用の際には、随時、最新の本規約および適用のある個別利用規約をご参照ください。</p>' +
'<p class="headlines">4. アカウント</p>' +
'<p>4.1. お客様は、本サービスの利用に際してお客様ご自身に関する情報を登録する場合、真実、正確かつ完全な情報を提供しなければならず、常に最新の情報となるよう修正しなければなりません。</p>' +
'<p>4.2. 本サービスに登録したお客様は、いつでもアカウントを削除して退会することができます。 </p>' +
'<p>4.3. 当社は、お客様が本規約に違反しまたは違反するおそれがあると認めた場合、あらかじめお客様に通知することなく、アカウントを停止または削除することができます。 </p>' +
'<p>4.4. 当社は、最終のアクセスから１年間以上経過しているアカウントを、あらかじめお客様に通知することなく削除することができます。</p>' +
'<p>4.5. お客様の本サービスにおけるすべての利用権は、理由を問わず、アカウントが削除された時点で消滅します。お客様が誤ってアカウントを削除した場合であっても、アカウントの復旧はできませんのでご注意ください。 </p>' +
'<p>4.6. 本サービスのアカウントは、お客様に一身専属的に帰属します。お客様の本サービスにおけるすべての利用権は、第三者に譲渡、貸与または相続させることはできません。</p>' +
'<p class="headlines">5.　プライバシー</p>' +
'<p>5.1. 当社は、お客様のプライバシーを尊重しています。</p>' +
'<p>5.2. 当社は、お客様のプライバシー情報と個人情報を、Chample プライバシーポリシーに従って適切に取り扱います。</p>' +
'<p>5.3.当社は、お客様から収集した情報を安全に管理するため、セキュリティに最大限の注意を払っています。</p>' +
'<p class="headlines">6. サービスの提供</p>' +
'<p>6.1. お客様は、本サービスを利用するにあたり、必要なパーソナルコンピュータ、携帯電話機、通信機器、オペレーションシステム、通信手段および電力などを、お客様の費用と責任で用意しなければなりません。</p>' +
'<p>6.2. 当社は、本サービスの全部または一部を、年齢、ご本人確認の有無、登録情報の有無、その他、当社が必要と判断する条件を満たしたお客様に限定して提供することができるものとします。 </p>' +
'<p>6.3. 当社は、当社が必要と判断する場合、あらかじめお客様に通知することなく、いつでも、本サービスの全部または一部の内容を変更し、また、その提供を中止することができるものとします。</p>' +
'<p class="headlines">7. 広告表示</p>' +
'<p>当社は、本サービスに当社または第三者の広告を掲載することができるものとします。</p>' +
'<p class="headlines">8. 提携パートナーのサービス</p>' +
'<p>本サービスは、当社と提携する他の事業者が提供するサービスまたはコンテンツを含む場合があります。かかるサービスまたはコンテンツに対する責任は、これを提供する事業者が負います。また、かかるサービスまたはコンテンツには、これを提供する事業者が定める利用規約その他の条件が適用されることがあります。</p>' +
'<p class="headlines">9.　コンテンツ</p>' +
'<p>9.1. 当社は、当社が提供する本コンテンツについて、お客様に対し、譲渡および再許諾できず、非独占的な、本サービスの利用を唯一の目的とする利用権を付与します。</p>' +
'<p>9.2. お客様は、利用料、利用期間等の利用条件が別途定められた本コンテンツを利用する場合、かかる利用条件に従うものとします。本サービスの画面上で「購入」、「販売」などの表示がされている場合であっても、当社がお客様に対し提供する本コンテンツに関する知的財産権その他の権利はお客様に移転せず、お客様には、上記の利用権のみが付与されます。 </p>' +
'<p>9.3. お客様は、本コンテンツを、本サービスが予定している利用態様を超えて利用(複製、送信、転載、改変などの行為を含みます。)してはなりません。 </p>' +
'<p>9.4. 投稿コンテンツのバックアップは、お客様ご自身で行なっていただくこととなります。当社は投稿コンテンツのバックアップを行う義務を負いません。 </p>' +
'<p>9.5. 本サービスは、複数のお客様が投稿、修正、削除等の編集を行える機能を含む場合があります。この場合、お客様はご自身の投稿コンテンツに対する他のお客様の編集を許諾するものとします。 </p>' +
'<p>9.6. お客様は、投稿コンテンツに対して有する権利を従前どおり保持し、当社がかかる権利を取得することはありません。ただし、投稿コンテンツのうち、お客様一般にも公開されたものに限り、お客様は、当社に対し、これをサービスやプロモーションに利用する権利（当社が必要かつ適正とみなす範囲で省略等の変更を加える権利を含みます。また、かかる利用権を当社と提携する第三者に再許諾する権利を含みます。）を、無償で、無期限に、地域の限定なく許諾したこととなります。 </p>' +
'<p>9.7. 当社は、法令または本規約の遵守状況などを確認する必要がある場合、投稿コンテンツの内容を確認することができます。ただし、当社はそのような確認を行なう義務を負うものではありません。</p>' +
'<p>9.8. 当社は、お客様が投稿コンテンツに関し法令もしくは本規約に違反し、または違反するおそれのあると認めた場合、その他業務上の必要がある場合、あらかじめお客様に通知することなく、投稿コンテンツを削除するなどの方法により、本サービスでの投稿コンテンツの利用を制限できます。</p>' +
'<p class="headlines">10. 利用料</p>' +
'<p>利用料は、理由を問わず、一切払い戻しを行いません。ただし、法令上必要な場合はこの限りではありません。この場合、利用料の払い戻し方法は、法令に従って当社が定め、当社のウェブサイト等に表示します。</p>' +
'<p class="headlines">11. 禁止事項</p>' +
'<p>お客様は、本サービスの利用に際して、以下に記載することを行なってはなりません。 </p>' +
'<p>11.1. 法令、裁判所の判決、決定もしくは命令、または法令上拘束力のある行政措置に違反する行為。</p>' +
'<p>11.2. 公の秩序または善良の風俗を害するおそれのある行為。</p>' +
'<p>11.3. 当社または第三者の著作権、商標権、特許権等の知的財産権、名誉権、プライバシー権、その他法令上または契約上の権利を侵害する行為。 </p>' +
'<p>11.4. 過度に暴力的な表現、露骨な性的表現、人種、国籍、信条、性別、社会的身分、門地等による差別につながる表現、自殺、自傷行為、薬物乱用を誘引または助長する表現、その他反社会的な内容を含み他人に不快感を与える表現を、投稿または送信する行為。 </p>' +
'<p>11.5. 当社または第三者になりすます行為または意図的に虚偽の情報を流布させる行為。</p>' +
'<p>11.6. 同一または類似のメッセージを不特定多数のお客様に送信する行為（当社の認めたものを除きます。）、その他当社がスパムと判断する行為。 </p>' +
'<p>11.7. 当社が定める方法以外の方法で、本コンテンツの利用権を、現金、財物その他の経済上の利益と交換する行為。</p>' +
'<p>11.8. 営業、宣伝、広告、勧誘、その他営利を目的とする行為（当社の認めたものを除きます。）、性行為やわいせつな行為を目的とする行為、異性との交際を目的とする行為、他のお客様に対する嫌がらせや誹謗中傷を目的とする行為、その他本サービスが予定している利用目的と異なる目的で本サービスを利用する行為。 </p>' +
'<p>11.9. 反社会的勢力に対する利益供与その他の協力行為。</p>' +
'<p>11.10. 宗教活動または宗教団体への勧誘行為。</p>' +
'<p>11.11. 他人の個人情報、登録情報、利用履歴情報などを、不正に収集、開示または提供する行為。 </p>' +
'<p>11.12. 本サービスのサーバやネットワークシステムに支障を与える行為、BOT、チートツール、その他の技術的手段を利用してサービスを不正に操作する行為、本サービスの不具合を意図的に利用する行為、同様の質問を必要以上に繰り返す等、当社に対し不当な問い合わせまたは要求をする行為、その他当社による本サービスの運営または他のお客様による本サービスの利用を妨害し、これらに支障を与える行為。 </p>' +
'<p>11.13. 上記11.1.から11.12のいずれかに該当する行為を援助または助長する行為。</p>' +
'<p>11.14. その他、当社が不適当と判断した行為。</p>' +
'<p class="headlines">12. お客様の責任</p>' +
'<p>12.1. お客様は、お客様ご自身の責任において本サービスを利用するものとし、本サービスにおいて行った一切の行為およびその結果について一切の責任を負うものとします。 </p>' +
'<p>12.2. 当社は、お客様が本規約に違反して本サービスを利用していると認めた場合、当社が必要かつ適切と判断する措置を講じます。ただし、当社は、かかる違反を防止または是正する義務を負いません。</p>' +
'<p>12.3. お客様は、本サービスを利用したことに起因して（当社がかかる利用を原因とするクレームを第三者より受けた場合を含みます。）、当社が直接的もしくは間接的に何らかの損害（弁護士費用の負担を含みます。）を被った場合、当社の請求にしたがって直ちにこれを補償しなければなりません。</p>' +
'<p class="headlines">13. 当社の免責</p>' +
'<p>13.1. 当社は、本サービス（本コンテンツを含みます。）に事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。当社は、お客様に対して、かかる瑕疵を除去して本サービスを提供する義務を負いません。 </p>' +
'<p>13.2. 当社は、本サービスに起因してお客様に生じたあらゆる損害について一切の責任を負いません。ただし、本サービスに関する当社とお客様との間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。 </p>' +
'<p>13.3. 上記13.2.ただし書に定める場合であっても、当社は、当社の過失（重過失を除きます。）による債務不履行または不法行為によりお客様に生じた損害のうち特別な事情から生じた損害（当社またはお客様が損害発生につき予見し、または予見し得た場合を含みます。）について一切の責任を負いません。また、当社の過失（重過失を除きます。）による債務不履行または不法行為によりお客様に生じた損害の賠償は、お客様から当該損害が発生した月に受領した利用料の額を上限とします。</p>' +
'<p class="headlines">14. 連絡方法</p>' +
'<p>14.1. 本サービスに関する当社からお客様への連絡は、当社が運営するウェブサイト内の適宜の場所への掲示その他、当社が適当と判断する方法により行ないます。 </p>' +
'<p>14.2. 本サービスに関するお客様から当社への連絡は、当社が運営するウェブサイト内の適宜の場所に設置するお問い合わせフォームの送信または当社が指定する方法により行っていただきます。</p>' +
'<p class="headlines">15. 準拠法、裁判管轄</p>' +
'<p>本規約は日本語を正文とし、その準拠法は日本法とします。本サービスに起因または関連してお客様と当社との間に生じた紛争については那覇地方裁判所または那覇簡易裁判所を第一審の専属的合意管轄裁判所とします。 </p>' +
'<p class="headlines" style="text-align:right;">以上</p>' +
'<p class="headlines">最終更新日：2016年02月09日</p>';

var termsMessage = '' +
'<p>The terms and conditions of use shown here(hereinafter referred to as the"Terms and Conditions")set forth the terms between Chample Corporation(hereinafter referred to as the"Company")and users(hereinafter referred to as the"User"or"Users"depending upon context)of any services or features of Chample(hereinafter referred to as the"Service"), which is provided by the Company.</p>' +
'<p class="headlines">1. Definitions</p>' +
'<p>The following words and terms shall have the meanings set forth below when they are used in the Terms and Conditions.</p>' +
'<p>1.1."content(s)"means information such as text, audio files, music, images, videos, software, programs, computer code, and the like. </p>' +
'<p>1.2."Content(s)"means content(s)that may be accessed through the Service. </p>' +
'<p>1.3."Submitted Content(s)"means content(s)that Users have submitted, transmitted, or uploaded. </p>' +
'<p>1.4."Separate Terms and Conditions"means documents released or uploaded by the Company that pertain to the Service, under the title"agreement,""guideline,""policy,"and the like.</p>' +
'<p class="headlines">2. Agreement to Terms and Conditions</p>' +
'<p>2.1. All Users shall use the Service in accordance with the terms stated in the Terms and Conditions. Users may not use the Service unless they agree to the Terms and Conditions. Such agreement is valid and irrevocable. </p>' +
'<p>2.2. You must be at least 18 years of age, or the age of majority in your province, territory or country, to become a member of the Chample service. Minors may only use the service under the supervision of an adult.</p>' +
'<p>2.3. By actually using the Service, Users are deemed to have agreed to the Terms and Conditions. Such agreement is valid and irrevocable. </p>' +
'<p>2.4. If there are Separate Terms and Conditions for the Service, Users also shall comply with such Separate Terms and Conditions as well as the Terms and Conditions.</p>' +
'<p class="headlines">3. Modification of the Terms and Conditions</p>' +
'<p>The Company may modify the Terms and Conditions or Separate Terms and Conditions when the Company deems necessary, without providing prior notice to Users. The modification will become effective once the modified Terms and Conditions or Separate Terms and Conditions are posted on an appropriate location within the website operated by the Company. Users shall be deemed to have granted valid and irrevocable consent to the modified Terms and Conditions or Separate Terms and Conditions by continuing to use the Service. Users shall refer to the Terms and Conditions on a regular basis when using the Service, since a separate notification regarding the modification to Terms and Conditions may not be provided.</p>' +
'<p class="headlines">4. Account</p>' +
'<p>4.1. Users, when providing information about him/herself to the Company, shall provide genuine, accurate, and complete information while using the Service, and keep such information up-to-date at all times.</p>' +
'<p>4.2. Any registered User to the Service may delete his/her account and withdraw from using the Service, at any time.</p>' +
'<p>4.3. The Company may suspend or delete a User\'s account without giving prior notice to the User if the Company believes that the User is violating or has violated the Terms and Conditions.</p>' +
'<p>4.4. The Company reserves the right to delete any account that has been inactive for a period of a year or more since its last activation, without any prior notice to the User.</p>' +
'<p>4.5. Users\'rights to use the service shall expire when their account has been deleted for any reason. The account cannot be retrieved even if Users have accidentally deleted their account, and the Company asks Users to be aware of this.</p>' +
'<p>4.6. Each account in the Service is for the exclusive use and belongs solely to the owner of the account. Users may not transfer or lend their accounts to any third party nor may their accounts be inherited by any third party.</p>' +
'<p class="headlines">5. Privacy</p>' +
'<p>5.1. The Company places its highest priority on the privacy of its Users.</p>' +
'<p>5.2. The Company promises to protect the privacy and personal information of its users in accordance with the Chample Privacy Policy.</p>' +
'<p>5.3. The Company promises to exercise the utmost care and attention regarding its security measures for the continued security of any and all User information.</p>' +
'<p class="headlines">6. Provision of the Service</p>' +
'<p>6.1. Users shall supply the necessary PC, mobile phone device, communication device, operating system, and data connection necessary for using the Service under Users\'own responsibility and at Users\'own expense.</p>' +
'<p>6.2. The Company reserves the right to limit access to the whole or part of the Service depending upon conditions that the Company considers necessary, such as age, identification, current membership status, and the like.</p>' +
'<p>6.3. The Company reserves the right to modify or cease, at the Company\'s own discretion, the whole or part of the Service at anytime without any prior notice to the Users.</p>' +
'<p class="headlines">7. Advertisements</p>' +
'<p>The Company reserves the right to provide Users with advertisements for the Company or a third party, through the Service.</p>' +
'<p class="headlines">8. Business Partners\'Services</p>' +
'<p>Contents or other services offered by other business partners cooperating with the Company may be included within the Service. The business partners bear all responsibility regarding such contents and/or services offered. Furthermore, such contents and services may be governed by the explicit terms and conditions etc., which are set accordingly by the business partners.</p>' +
'<p class="headlines">9. Contents</p>' +
'<p>9.1. The Company grants Users the non-transferable, non-re-licensable, non-exclusive license to use the Contents provided by the Company, only for the purpose of using the Service.</p>' +
'<p>9.2. Users shall abide by the appropriate conditions when using Contents which are subject to additional fees and periods of use. Notwithstanding situations where phrases such as"Purchase","Sales,"and the like appear on the Service screens, the Company shall remain the holder of all intellectual property rights as well as all other rights in the Contents offered to Users by the Company, and such rights shall not be transferred to Users.</p>' +
'<p>9.3. Users shall not use the Contents beyond the scope of the intended use of the Contents in the Service(including but not limited to copying, transmission, reproduction, modification).</p>' +
'<p>9.4. If Users wish to back-up the whole or part of the Submitted Contents, they will need to do so themselves. The Company will not undertake the obligation of backing up any of the Submitted Contents.</p>' +
'<p>9.5. The Service may include functions where multiple users may post, correct, edit, and delete items. In such cases, the User who posted his/her Submitted Contents has to allow other Users to perform any editing in relation to the Submitted Contents.</p>' +
'<p>9.6. Users shall maintain the rights regarding their Submitted Contents just as before, and the Company shall not acquire any rights to such contents. However, if the Submitted Contents are visible to all the other Users, the User who posts the Submitted Content shall grant the Company a worldwide, non-exclusive, royalty-free license(with the right to sublicense such content to other third parties working together with the Company), for an indefinite period, to use(after modifying such content, if the Company believes it necessary and proper)such content for services and/or promotional purposes.</p>' +
'<p>9.7. The Company may check the details of the Submitted Contents, when the Company believes that the Submitted Contents may violate related laws or provisions set out in the Terms and Conditions. However, the Company is not obligated to conduct such investigations.</p>' +
'<p>9.8. If the Company believes that the User has violated or may violate applicable laws or provisions in the Terms and Conditions related to Submitted Contents, then the Company reserves the right to preclude the User\'s use of the Submitted Contents in certain manners, such as deleting the Submitted Content without providing the User with prior notice.</p>' +
'<p class="headlines">10. Payments</p>' +
'<p>Payments cannot be refunded for any reason. However, this does not apply if required by applicable laws. If this occurs, the Company shall process refunds in accordance with the relevant laws, and such information will be made available on the Company\'s website etc.</p>' +
'<p class="headlines">11. Restrictions</p>' +
'<p>Users shall not engage in the following when using the Service.</p>' +
'<p>11.1. Activities that violate the law, court verdicts, resolutions or orders, or administrative measures that are legally binding.</p>' +
'<p>11.2. Activities that may hinder public order or customs.</p>' +
'<p>11.3. Activities that infringe intellectual property rights, such as copyrights, trademarks and patents, fame, privacy, and all other rights of the Company and/or a third party granted by the law or contract.</p>' +
'<p>11.4. Activities that post or transmit violent or sexual expressions;expressions that lead to discrimination by race, national origin, creed, sex, social status, family origin, etc.;expressions that induce or encourage suicide, self-injury behavior, or drug abuse;or anti-social expressions that include anti-social content and lead to the discomfort of others.</p>' +
'<p>11.5. Activities that lead to the misrepresentation of the Company and/or a third party, or intentionally spread false information.</p>' +
'<p>11.6. Activities such as sending messages indiscriminately to numerous Users(except for those approved by the Company) or any other activities deemed to be spamming by the Company.</p>' +
'<p>11.7. Activities that exchange the right to use the Contents into cash, property or other economic benefits without Company\'s authorization.</p>' +
'<p>11.8. Activities that use the Service for sales, marketing, advertisement, soliciting or other commercial purposes(except for those approved by the Company);use the Service for the purpose of sexual conducts or obscene acts.use the Service for the purpose of meeting a person for sexual encounters.use the Service for the purpose of harassments or libelous attacks against other Users;or use the Service for purposes other than the Service\'s true intent.</p>' +
'<p>11.9. Activities that benefit or collaborate with anti-social groups.</p>' +
'<p>11.10. Activities that are related to religious activities or invitations to certain religious groups.</p>' +
'<p>11.11. Activities that illegally or improperly lead to the collection, disclosure, or provision of other\'s personal information, registered information, user history, or the like.</p>' +
'<p>11.12. Activities that interfere with the servers and/or network systems of the Service;that abuse the Service by means of BOTs, cheat tools, or other technical measures;that deliberately use defects of the Service;that make unreasonable inquires and/or undue claims such as repeatedly asking the same question beyond the necessity, and that interfere with the Company\'s operation of the Service or Users\'use of the Service.</p>' +
'<p>11.13. Activities that aid or encourage any activity stated in Clauses 1 to 12 above.</p>' +
'<p>11.14. Other activities that are deemed by the Company to be inappropriate.</p>' +
'<p class="headlines">12. User Responsibility</p>' +
'<p>12.1. Users shall use this Service at his/her own risk, and shall bear all responsibility for actions carried out and their results upon this Service.</p>' +
'<p>12.2. The Company may take measures that the Company considers necessary and appropriate, if the Company acknowledges that a User is using the service in a way which violates the Terms and Conditions. However, the Company shall not be responsible for correcting or preventing such violation towards Users or others.</p>' +
'<p>12.3. In the case where the Company has suffered loss/damage or has been charged an expense(including but not limited to lawyer\'s fees)directly or indirectly(including but not limited to cases where the Company has been sued for damages by a third party)due to the User violating applicable laws or the Terms and Conditions while using the Service, the User shall immediately compensate the Company upon its request.</p>' +
'<p class="headlines">13. The Company\'s Exemption of Liability</p>' +
'<p>13.1. The Company does not expressly or impliedly guarantee that the Service(including the Contents)are free from de facto or legal flaws(including but not limited to stability, reliability, accuracy, integrity, effectiveness, fitness for certain purposes, security-related faults, errors, bugs, or infringements of rights). The Company shall not be responsible for providing the Service without such defects.</p>' +
'<p>13.2. The Company shall not be responsible for any damages inflicted upon Users in relation to the use of the Service. However, if the agreement(including but not limited to the Terms and Conditions)between the Company and Users regarding the Service shall be deemed as a consumer contract under the Consumer Contract Law in Japan, then this exemption clause shall not be applied.</p>' +
'<p>13.3. Notwithstanding the condition stated in clause 13.2 above, the Company shall not be responsible for any indirect, special, incidental, consequential or punitive damages(including but not limited to such damages that the Company or Users predicted or could have predicted)with respect to the Company\'s contractual default or act of tort due to the Company\'s negligence(except for gross negligence). The compensation for ordinary damages in respect to the Company\'s contractual default or act of tort due to the Company\'s negligence(except for gross negligence)shall be limited to the total amount of received fees from the User in the particular calendar month in which such damages occurred.</p>' +
'<p class="headlines">14. Notification and Contact</p>' +
'<p>14.1.When the Company notifies or contacts Users regarding the Service, the Company may use a method that the Company considers appropriate, such as posting on the website operated by the Company.</p>' +
'<p>14.2.When Users notifies or contacts the Company in regard to the Service, Users shall use the customer inquiry form available on the website operated by the company or other means designated by the Company.</p>' +
'<p class="headlines">15.Governing Law and Jurisdiction</p>' +
'<p>Where the Company has provided Users with a translation of the Japanese language version of the Terms and Conditions(hereinafter referred to as"Japanese Version"), the Japanese Version will govern the relationship between Users and the Company.In the event of a contradiction between the Japanese Version and a translation, the provisions in the Japanese Version shall take precedence over any other translation.These Terms and Conditions will be governed by the laws of Japan.Conflicts that arise from the Service or conflicts between Users and the Company related to the Service will be governed primarily under the exclusive jurisdiction of the District Court of Naha or the Naha Summary Court.</p>' +
'<p class="headlines" style="text-align:right;">End</p>' +
'<p class="headlines">Last updated on February9, 2016</p>';

var policyMessageJP = "" +
'<p>私たちChample株式会社（以下、「当社」といいます）は、当社が提供するChample におけるお客様情報を以下の通り取り扱います。</p>' +
'<p class="headlines">適用範囲</p>' +
'<p>本プライバシーポリシーはChampleに関する全てのサービス（以下、「本サービス」といいます）に適用されます。別途にサービス別のプライバシーポリシーまたは個別利用規約等（以下、「個別規約」といいます）においてお客様情報の取り扱いを規定する場合は、個別規約も適用されます。本プライバシーポリシーと個別規約において矛盾が発生する場合は個別規約が優先されます。</p>' +
'<p>なお、リンク先など他事業者等による個人情報収集は、本プライバシーポリシーの適用範囲ではございません。また、本プライバシーポリシーは日本国内でご利用のお客様に適用されます。日本以外でご利用のお客様は<span onclick="japanese()" style="cursor:pointer;text-decoration:underline;">こちら</span>をご覧ください。</p>' +
'<p class="headlines">取得する情報及び利用方法</p>' +
'<p>当社は本サービスにおいて次のように情報を取得及び利用いたします。</p>' +
'<p class="headlines">ご提供いただく情報</p>' +
'<p class="headlines">• メールアドレス</p>' +
'<p>本サービスのアカウントを作成する際、メールアドレスを以下の目的で取得する場合がございます。</p>' +
'<p>1)本サービスにログインするため</p>' +
'<p>2)不正利用防止のため</p>' +
'<p>この情報は、他のお客様には公開されません。また、情報のご登録はお客さまの任意ですが、ご登録いただけない場合、本サービスまたは本サービスの一部をご利用いただけない場合がございます。なお、お客様が本サービスのアカウントを削除した場合、これらの情報は当社規定に従って削除いたします。</p>' +
'<p class="headlines">• その他ご登録いただく情報</p>' +
'<p>本サービスの円滑利用やお客様間で円滑にコミュニケーションを行っていただく等の目的で、プロフィール情報（本サービス上での表示名、アイコン画像、メッセージ等）等をご登録いただく場合がございます。なお、本サービス上で表示するためのプロフィール情報や他のお客様へ公開するためにお客様自身が登録、投稿した情報（テキスト、画像等）は他のお客様も閲覧できます。ご登録はお客様の任意ですが、ご登録いただけない場合、本サービスまたは本サービスの一部をご利用いただけない場合がございます。</p>' +
'<p class="headlines">• お支払い情報</p>' +
'<p>商品購入や有料サービス利用時等、お客様にご利用代金をお支払いいただくためにクレジットカード情報等を取得する場合がございます。なお、決済は決済代行会社が行い、当社はクレジットカード情報を保有いたしません。</p>' +
'<p class="headlines">サービス利用情報</p>' +
'<p class="headlines">•  クッキー（Cookie）</p>' +
'<p>ユーザーの設定内容の保存等お客様の利便性向上のため、セッションの維持及び保護等セキュリティのため、お客様が利用した本サービスに対する訪問回数及び利用形態、お客様の規模等の把握により、より良いサービスを提供するためにクッキーを利用いたします。また、本サービスではGoogle Analyticsを利用する場合がございます。</p>' +
'<p>お客様はクッキーの使用可否を選択できますが、クッキーの保存を拒む場合にはログインが必要なサービス等、本サービスの一部をご利用いただけない場合がございます。</p>' +
'<p class="headlines">•  ログ</p>' +
'<p>お客様が本サービスを利用した際にIP アドレス、ブラウザ種類、ブラウザ言語等の情報が自動で生成、保存されます。これらの情報は利用者環境を分析し、より良いサービス提供のため、また正常なサービス提供を妨害する不正行為防止のために利用いたします。</p>' +
'<p class="headlines">• 機器情報</p>' +
'<p>お客様が利用される機器情報（OS、端末の個体識別情報、コンピュータ名、広告ID等）を取得する場合がございます。また、取得した広告IDを当社がお客様に付与した内部識別子に紐付ける場合がございます。これらの情報はより良いサービス提供のため、またご本人確認や正常なサービス提供を妨害する不正行為防止のために利用いたします。</p>' +
'<p class="headlines">情報の利用目的</p>' +
'<p>当社は取得した個人情報を以下の目的で利用いたします。なお、取得時に利用目的を限定した場合は、その範囲内でのみ利用いたします。</p>' +
'<p>• 不正利用防止のため</p>' +
'<p>• お客様が本サービスを円滑に利用できるようにするため</p>' +
'<p>• 本サービス利用に関する統計データを作成するため</p>' +
'<p>• 現在提供している本サービスまたは今後提供を検討している本サービスに関するアンケート実施のため</p>' +
'<p>• お客様からのお問い合わせに対する対応のため</p>' +
'<p>• 本サービスに関する情報等または当社以外の事業者が広告主となる広告情報等を告知するため</p>' +
'<p>• 今後の本サービスに関する新企画立案を行い提供するため</p>' +
'<p>• お客様からのお問い合わせ時等、本人確認を行うため</p>' +
'<p>• 商品購入時や有料サービス利用時等におけるご請求処理のため</p>' +
'<p>• その他本サービスに関する重要なお知らせ等、必要に応じた連絡を行うため</p>' +
'<p class="headlines">情報の提供</p>' +
'<p>当社はお客様の個人情報を下記の場合を除いて第三者に提供することはございません。</p>' +
'<p>• ご本人が事前に同意した場合</p>' +
'<p>•  法律に基づく場合 </p>' +
'<p>• お客様が本サービスの利用規約に違反し、弊社の権利、財産やサービス等を保護するために、個人情報を公開せざるをえないと判断するに足る十分な根拠がある場合</p>' +
'<p>•  人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難である場合 </p>' +
'<p>•  公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難である場合</p>' +
'<p>• 国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがある場合</p>' +
'<p>• 合併、会社分割、営業譲渡その他の事由によって個人情報の提供を含む弊社の事業の承継が行われる場合</p>' +
'<p class="headlines">情報の預託</p>' +
'<p>当社は利用目的の達成に必要な範囲内においてお客様から取得した個人情報の全部または一部を業務委託先に預託することがございます。その際、業務委託先としての適格性を十分審査するとともに、契約にあたって守秘義務に関する事項等を規定し、情報が適正に管理される体制作りを行います。</p>' +
'<p class="headlines">情報の共同利用</p>' +
'<p>本サービスを提供するにあたり、当社と共同して業務を行うビジネスパートナーが必要な場合には、お客様の個人情報をそのビジネスパートナーと共同利用することがあります。この場合に当社は、利用目的、ビジネスパートナーの名称、情報の種類、管理者の名称についてお客様に公表した上で共同利用することといたします。</p>' +
'<p class="headlines">利用者の権利</p>' +
'<p>お客様はいつでもご登録されているメールアドレス等の情報を、本サービスサイト上で訂正することができます。また、アカウントを削除することができます。</p>' +
'<p>お客様は当社に対し、サービスサイト上で確認できない個人情報の開示を求める場合、当社が別途定めた手続きに従って、次の場合を除き開示を請求することができます。</p>' +
'<p>• 開示することで本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合</p>' +
'<p>• 開示することで当社の業務の適正な実施に著しい支障を及ぼすおそれがある場合</p>' +
'<p>• 開示することが法令に違反することとなる場合</p>' +
'<p>• 開示の請求がご本人からであることが確認できない場合</p>' +
'<p>開示の結果、お客様が当社保有の個人情報の内容が事実でないと判断した場合は、当社が別途定めた手続きに従って、個人情報の訂正・追加・削除を請求することができます。その場合、当社は利用目的の達成に必要な範囲内で遅滞なく調査を行い、その結果に基づき当該個人情報の訂正・追加・削除を行います。</p>' +
'<p>なお、サービスサイト上で確認できない個人情報の開示を請求される場合には、当社が別途定めた手続きに従って開示手数料をいただく場合がございます。</p>' +
'<p>お客様から当社への個人情報の提供は任意ですが、必要な情報をご提供いただけない場合、本サービスの一部を利用できない場合がございます。</p>' +
'<p class="headlines">退会者の情報</p>' +
'<p>本サービスのアカウントを削除した場合、お客様情報は関連法規および社内規定に従って適切に処理いたします。</p>' +
'<p class="headlines">本プライバシーポリシーの改定</p>' +
'<p>本プライバシーポリシーは改定されることがあります。重要な変更にあたってはお客様に対してわかりやすい方法にて改定内容を告知いたします。</p>' +
'<p class="headlines">お問い合わせ</p>' +
'<p>本プライバシーポリシーに関してご不明な点がある場合、本サービスにおける個人情報の取り扱いに関するご質問・苦情・ご相談等があります場合は "Contact Us"(画面右上) よりご連絡ください。</p>' +
'<p class="headlines">2016年2月9日制定</p>';

var policyMessage = "" +
'<p class="headlines">1.Introduction</p>' +
'<p>We, Chample Corporation (“Chample,” “we,” “us,” or “our), believe your privacy is very important.</p>' +
'<p>To fulfill our commitment to respecting and protecting your privacy, we will adhere to our basic principles as explained in detail below, and crafted this Privacy Policy in accordance with these basic principles:</p>' +
'<p>1.We inform you of the personal information that will be collected, and seek your consent to collect, use, or disclose your personal information.</p>' +
'<p>2.We identify the purposes of use for collecting your personal information.</p>' +
'<p>3.We collect only information that is necessary to carry out the identified purposes of use.</p>' +
'<p>4.We use or disclose your personal information only for the purposes for which it is collected, except with your consent or as required or permitted by law, and we will keep your information only as long as necessary to fulfill those purposes.</p>' +
'<p>5.We endeavor to make sure that your personal information is accurate, complete, and up-to-date.</p>' +
'<p>6.We protect your personal information by appropriate security safeguards.</p>' +
'<p>7.We make our policies and practices for the handling of your personal information as transparent as possible.</p>' +
'<p>8.You will have access to your personal information and will be able to correct your personal information as appropriate.</p>' +
'<p>9.We will be accountable to you.  We are always interested in hearing your opinion regarding our compliance with these principles, this Privacy Policy, and applicable law.</p>' +
'<p class="headlines">2.What This Privacy Policy Applies To</p>' +
'<p class="headlines">a.What Is This Privacy Policy?</p>' +
'<p>This Privacy Policy explains how Chample will handle and safeguard your personal information, and the choices you have to access and control your personal information.  This Privacy Policy applies to: personal information you provide us when you use the Chample App, optional services made available within the Chample App, and other apps that integrate with or work in conjunction with the Chample App (collectively “Apps”); personal information you provide us when you visit websites maintained by us relating to our Apps (“Websites”) (Apps and Websites are collectively referred to as the “Service”); and personal information about you provided by users of the Service.</p>' +
'<p>This Privacy Policy applies if you are using the Service from anywhere outside of Japan.  If you are using the Service in Japan, please refer to our <span onclick="japanese()" style="cursor:pointer;text-decoration:underline;">Japan Privacy Policy</span>.</p>' +
'<p class="headlines">b.What Privacy Policy Applies to Other Chample Services?</p>' +
'<p>Users may request additional services from Chample or Chample affiliates.  Because the needs and choices of each user vary, we provide separate privacy policies or addendums to this Privacy Policy for certain additional services.  The separate privacy policies and addendums explain the types of information we collect, their purposes of use, and other policies that may apply to that service.  When you choose to use an additional service, you will be informed of the applicable privacy policy or addendum, which applies in addition to and may modify this Privacy Policy, before you can access the additional service.</p>' +
'<p>Please note that, you can check your applicable privacy policy or addendum within the Apps that you are using or Websites you are visiting.</p>' +
'<p class="headlines">3.Types of Information We Collect</p>' +
'<p class="headlines">a.What Information Does Chample Collect?</p>' +
'<p>To provide you the Service, Chample collects and uses the following types of information:</p>' +
'<p class="headlines">i.Information for Account Creation and Registration</p>' +
'<p>When you register with us and create a Chample account to use the Chample App, Chample will ask you to provide your email adress.  This information is necessary because we send text message via Email as part of our ongoing efforts to detect and deter unauthorized or fraudulent use of or abuse of the Service. We may also use your registered email adress to provide you important information about the Service.</p>' +
'<p class="headlines">ii.Device Information and Access Logs When You Use Our Service</p>' +
'<p>When you use the Service or visit our Website, we may obtain and maintain certain electronic identification or log data from your mobile device or personal computer such as: OS type, IP address, browser information including type and language settings, device identifier, advertising identifier or mobile application identifier.</p>' +
'<p>This information is necessary as part of our ongoing efforts to detect and deter unauthorized or fraudulent use of or abuse of the Service, as well as to provide you and optimize the Service for your environment. Also, please note that, an advertising identifier may be associated with our internal identifier.</p>' +
'<p class="headlines">b.What Other Information Might Chample Collect?</p>' +
'<p>To improve your experience when using the Service, we provide additional functionalities. If you choose to use such functionalities, we may ask you to provide following types of information:</p>' +
'<p class="headlines">Payment Information [OPTIONAL]</p>' +
'<p>If you choose to purchase or use a fee-based service and pay for such service, we may collect your credit card information.  We will use your credit card information only to process your purchase or use our fee-based service.  Please note that, we will not retain your credit card information because your credit-card settlement will be handled by appropriate payment agencies.</p>' +
'<p class="headlines">c.What About Information I Create About Myself and Share With Others?</p>' +
'<p class="headlines">User-Generated Content [OPTIONAL]</p>' +
'<p>In addition to the information describe above, you may choose to create “user-generated content,” such as your profile information (i.e., “display name,” profile picture, and the biographies), text and photos, videos and share your user-generated content with other users. Please remember that the user-generated content you share with others can be copied, stored, or disseminated by the recipients and accessed by unintended recipients due to the nature of digital data.  We encourage you to pay close attention when you generate and share your information or contents.</p>' +
'<p class="headlines">4.How We Use and Handle Your Information</p>' +
'<p class="headlines">a.How Does Chample Use My Information?</p>' +
'<p>To provide the Service, Chample, as a data controller or joint data controller, uses your information for the following purposes:</p>' +
'<p>•to provide you the Service via your mobile phone or personal computer and to allow you to transmit your user-generated content to other Chample users;</p>' +
'<p>•to verify your identity;</p>' +
'<p>•to enable you to sync other applications offered by Chample, Chample affiliates, and Chample business partners together with your Chample account and to share information between the applications you use;</p>' +
'<p>•to respond to requests you may make to use services provided by Chample other than the Chample app service;</p>' +
'<p>•to detect and deter unauthorized or fraudulent use of or abuse of the Service;</p>' +
'<p>•to improve and/or optimize the Service;</p>' +
'<p>•to enable us to provide customer support, and to respond effectively to your inquiries and claims;</p>' +
'<p>•to conduct user surveys;</p>' +
'<p>•to provide you with information regarding the Service;</p>' +
'<p>•to measure the effectiveness of advertisements that we place on the Internet or in other media;</p>' +
'<p>•to notify users of any other important information regarding the Service, if necessary;</p>' +
'<p>•to identify winners of promotional contests, to send gifts to those winners, and to deliver purchased products and the like;</p>' +
'<p>•to aggregate anonymized statistical data regarding the Service;</p>' +
'<p>•to comply with applicable laws or legal obligations.</p>' +
'<p>If, however, we provide you with more specific purpose(s) of use either at the time we ask you to provide your personal information or through another means, then such notice will take precedence over the general purposes of use stated in Section 4.a of this Privacy Policy.</p>' +
'<p class="headlines">b.How Does Chample Protect My Information?</p>' +
'<p>Because no method of electronic transmission or method of data storage is perfect or impenetrable, we cannot guarantee that your information will be absolutely safe from intrusion during transmission or while stored in our systems.</p>' +
'<p>To help protect your privacy and confidentiality of your information, we also need to ask for your cooperation regarding the following:  Please notify us in the event you suspect any unauthorized use of your account or any other breach of security via our Contact Form .</p>' +
'<p class="headlines">c.Where Is My Information Transmitted and Stored?</p>' +
'<p>To provide the Service in a reliable and responsible manner, Chample processes and stores your information on secure servers which may be physically located in different countries around the world, including countries outside the European Economic Area.</p>' +
'<p>By continuing to use the Service, you agree that your information may be internationally transferred and that Chample can process and store your information in a country other than where you submitted.</p>' +
'<p class="headlines">d.How Long Does Chample Keep My Information?</p>' +
'<p>Chample retains your personal information you provide while: your account is in existence; for the length of time needed to fulfill any of the applicable purposes of use described in this Privacy Policy; or to comply with applicable laws and regulations.</p>' +
'<p>We may retain your personal information even after your account is closed if retention is reasonably necessary:</p>' +
'<p>•to comply with applicable laws, regulations or legal obligations;</p>' +
'<p>•to provide and complete customer support service;</p>' +
'<p>•to resolve disputes between or with Chample users;</p>' +
'<p>•to detect and deter unauthorized or fraudulent use of or abuse of the Service.</p>' +
'<p class="headlines">e.Does Chample Use Outside Service Providers or Agents?</p>' +
'<p>To facilitate and provide you with the Service, it sometimes is necessary for Chample to request third party partner service providers or agents to help us process and/or store your personal information.  We strictly evaluate the partner service providers and agents, and we make every effort to ensure that they have established appropriate and secure information administration and organizational control systems, and we strictly require that they comply with applicable laws and regulations.  We also require that they access your personal information only the extent necessary to perform tasks on our behalf.</p>' +
'<p class="headlines">f.Does Chample Give My Information to Third Parties?</p>' +
'<p>Other than as described in this Privacy Policy and, where relevant, other applicable privacy policies or addendums,Chample will never provide your information to any third parties without your consent, unless we believe in good faith that we are required or permitted to do so under applicable laws or to protect and defend Chample’s rights and/or property.</p>' +
'<p class="headlines">g.Does Chample Use Cookies or Other Similar Technologies?</p>' +
'<p>We use cookies and similar technologies, including local storage:</p>' +
'<p>•to help us maintain your session when you use the Service;</p>' +
'<p>•to enhance security;</p>' +
'<p>•to remember information about your browser and your preferences;</p>' +
'<p>•to help us understand how people use the Services and improve the Service.</p>' +
'<p>For example, we may use Google Analytics to assist us with this.</p>' +
'<p>By continuing to user the Service, you are agreeing to our use of cookies and similar technologies in accordance with this Privacy Policy.</p>' +
'<p>Most browsers allow you to control whether or not to accept cookies. If you, however, deactivate cookies or limit the ability to set cookies, you may not be able to use certain parts or all functions, or limit your overall user experience.</p>' +
'<p class="headlines">5.Your Choices, Your Rights</p>' +
'<p>It is possible that Chample obtains personal information relating to individuals who are currently not users of the Service.  Please note that, regardless of whether or not you are a user of the Service, you have the choices and rights under this section if we hold your personal information.</p>' +
'<p class="headlines">How Do I Control My Information?</p>' +
'<p>Chample has tried to make it as easy as possible for you to have control over your personal information.  You can confirm and revise most of your personal information at any time.  For example:</p>' +
'<p>•under your “Settings”, you can revise your email adress, you can confirm and revise your nickname, profile picture , country and biographies;</p>' +
'<p>In addition to your ability to check, correct, block, or delete your information directly through the Chample App, if we hold your personal information, you can always send us a written request at any time to confirm, correct, block, or delete any other personal information that we hold which cannot be confirmed directly on the Chample App.  Upon verification of your identity, we will respond to your request within a reasonable period of time and in accordance with relevant law.  </p>' +
'<p>To check, correct, block, or delete your information, please contact us via "Contact Us"(top right of the screen). If you no longer wish to use the Service or if you no longer wish to consent to Chample’s collection and use of your personal information, you may choose to delete your entire account directly through the Chample App.  We will take reasonable measures to delete your information in accordance with Section 4.d.</p>' +
'<p class="headlines">6.Other Important Information for You</p>' +
'<p class="headlines">a.I have Questions/Comments/Concerns</p>' +
'<p>If you have any questions, comments, or concerns about this Privacy Policy or our other privacy policies or practices, please contact us via "Contact Us"(top right of the screen).</p>' +
'<p class="headlines">b.Changes to This Privacy Policy</p>' +
'<p>We may modify our Privacy Policy from time to time for various reasons including to improve our privacy practices, to reflect changes to our Service, and to comply with relevant law.  The last time we updated this Privacy Policy was 9th of February, 2016, and it was initially released on 9th of February, 2016.</p>' +
'<p>When we make any material changes to our Privacy Policy, we will provide notice to you on our Service, or by other reasonable means.  We encourage you to review changes carefully.  If you agree to the changes, then please continue to use our Service.  If you, however, do not agree to any of the changes and you no longer wish to use our Service, you may choose to close your account.  Continuing to use our Service after a notice of changes has been communicated to you or published on our Service constitutes your acceptance of changes and consent to the modified Privacy Policy.</p><br />';