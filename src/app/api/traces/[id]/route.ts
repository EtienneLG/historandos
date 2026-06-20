import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const traceId = await params.id;
  const gpxRawXml1 = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1"  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
<metadata>
<desc>Trace: ${traceId}</desc>
</metadata>
<wpt lat="46.1912372" lon="5.3645897">
<time>2026-06-19T03:25:38Z</time>
<name>FINISH</name>
<cmt>FINISH</cmt>
<desc>FINISH</desc>
<sym>Flag, Blue</sym>
<type>Waypoint</type>
</wpt>
<trk>
<name>${traceId}</name>
<trkseg>
<trkpt lat="46.1908298" lon="5.36483">
<ele>320</ele>
<time>2026-06-19T00:00:00Z</time></trkpt>
<trkpt lat="46.2128486" lon="5.365448">
<ele>324</ele>
<time>2026-06-19T00:39:19Z</time></trkpt>
<trkpt lat="46.2210532" lon="5.3618431">
<ele>359</ele>
<time>2026-06-19T00:58:54Z</time></trkpt>
<trkpt lat="46.2063389" lon="5.343647">
<ele>508</ele>
<time>2026-06-19T01:54:21Z</time></trkpt>
<trkpt lat="46.1875679" lon="5.3355789">
<ele>513</ele>
<time>2026-06-19T02:39:00Z</time></trkpt>
<trkpt lat="46.1912372" lon="5.3645897">
<ele>316</ele>
<time>2026-06-19T03:25:38Z</time></trkpt>
</trkseg>
</trk>
</gpx>`

  const gpxRawXml2 = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1"  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
<metadata>
<desc>Trace: ${traceId}</desc>
</metadata>
<wpt lat="45.733451" lon="5.826043">
<time>2026-06-19T00:16:02Z</time>
<name>Tournez à </name>
<cmt>Tournez à droite</cmt>
<desc>Tournez à droite</desc>
<sym>Right</sym>
<type>Waypoint</type>
</wpt>
<wpt lat="45.737944" lon="5.82581">
<time>2026-06-19T00:30:42Z</time>
<name>Restez sur</name>
<cmt>Restez sur la droite</cmt>
<desc>Restez sur la droite</desc>
<sym>Right_slight</sym>
<type>Waypoint</type>
</wpt>
<wpt lat="45.739967" lon="5.824697">
<time>2026-06-19T00:37:37Z</time>
<name>Restez sur</name>
<cmt>Restez sur la gauche</cmt>
<desc>Restez sur la gauche</desc>
<sym>Straight</sym>
<type>Waypoint</type>
</wpt>
<wpt lat="45.741793" lon="5.818466">
<time>2026-06-19T00:49:16Z</time>
<name>Tournez à </name>
<cmt>Tournez à gauche</cmt>
<desc>Tournez à gauche</desc>
<sym>Left</sym>
<type>Waypoint</type>
</wpt>
<wpt lat="45.746679" lon="5.818531">
<time>2026-06-19T01:01:54Z</time>
<name>Tournez à </name>
<cmt>Tournez à droite</cmt>
<desc>Tournez à droite</desc>
<sym>Right</sym>
<type>Waypoint</type>
</wpt>
<wpt lat="45.748479" lon="5.823391">
<time>2026-06-19T01:09:54Z</time>
<name>Tournez à </name>
<cmt>Tournez à droite</cmt>
<desc>Tournez à droite</desc>
<sym>Right</sym>
<type>Waypoint</type>
</wpt>
<wpt lat="45.746726" lon="5.827474">
<time>2026-06-19T01:19:20Z</time>
<name>Tournez à </name>
<cmt>Tournez à droite sur Chemin du Mont</cmt>
<desc>Tournez à droite sur Chemin du Mont</desc>
<sym>Right</sym>
<type>Waypoint</type>
</wpt>
<wpt lat="45.745797" lon="5.827894">
<time>2026-06-19T01:20:40Z</time>
<name>Restez sur</name>
<cmt>Restez sur la gauche</cmt>
<desc>Restez sur la gauche</desc>
<sym>Straight</sym>
<type>Waypoint</type>
</wpt>
<wpt lat="45.745187" lon="5.829095">
<time>2026-06-19T01:23:07Z</time>
<name>Tournez à </name>
<cmt>Tournez à gauche</cmt>
<desc>Tournez à gauche</desc>
<sym>Left</sym>
<type>Waypoint</type>
</wpt>
<wpt lat="45.745187" lon="5.829095">
<time>2026-06-19T01:24:30Z</time>
<name>Tournez à </name>
<cmt>Tournez à gauche</cmt>
<desc>Tournez à gauche</desc>
<sym>Left</sym>
<type>Waypoint</type>
</wpt>
<wpt lat="45.740492" lon="5.829588">
<time>2026-06-19T01:39:09Z</time>
<name>Tournez à </name>
<cmt>Tournez à droite</cmt>
<desc>Tournez à droite</desc>
<sym>Right</sym>
<type>Waypoint</type>
</wpt>
<wpt lat="45.739116" lon="5.826353">
<time>2026-06-19T02:01:32Z</time>
<name>Tournez à </name>
<cmt>Tournez à gauche</cmt>
<desc>Tournez à gauche</desc>
<sym>Left</sym>
<type>Waypoint</type>
</wpt>
<wpt lat="45.737944" lon="5.82581">
<time>2026-06-19T02:07:07Z</time>
<name>Tournez lé</name>
<cmt>Tournez légèrement à gauche</cmt>
<desc>Tournez légèrement à gauche</desc>
<sym>Left_slight</sym>
<type>Waypoint</type>
</wpt>
<wpt lat="45.733451" lon="5.826043">
<time>2026-06-19T02:34:56Z</time>
<name>Tournez à </name>
<cmt>Tournez à gauche</cmt>
<desc>Tournez à gauche</desc>
<sym>Left</sym>
<type>Waypoint</type>
</wpt>
<wpt lat="45.730052" lon="5.831347">
<time>2026-06-19T02:44:54Z</time>
<name>FINISH</name>
<cmt>FINISH</cmt>
<desc>FINISH</desc>
<sym>Flag, Blue</sym>
<type>Waypoint</type>
</wpt>
<trk>
<name>${traceId}</name>
<trkseg>
<trkpt lat="45.7300898" lon="5.8312511">
<ele>1013</ele>
<time>2026-06-19T00:00:00Z</time></trkpt>
<trkpt lat="45.730052" lon="5.831347">
<ele>1009</ele>
<time>2026-06-19T00:00:09Z</time></trkpt>
<trkpt lat="45.730498" lon="5.83171">
<ele>1011</ele>
<time>2026-06-19T00:01:14Z</time></trkpt>
<trkpt lat="45.7308" lon="5.831269">
<ele>1019</ele>
<time>2026-06-19T00:02:14Z</time></trkpt>
<trkpt lat="45.731023" lon="5.83117">
<ele>1016</ele>
<time>2026-06-19T00:02:50Z</time></trkpt>
<trkpt lat="45.731639" lon="5.830532">
<ele>1026</ele>
<time>2026-06-19T00:04:57Z</time></trkpt>
<trkpt lat="45.73217" lon="5.829862">
<ele>1035</ele>
<time>2026-06-19T00:07:22Z</time></trkpt>
<trkpt lat="45.732319" lon="5.829239">
<ele>1047</ele>
<time>2026-06-19T00:09:12Z</time></trkpt>
<trkpt lat="45.732579" lon="5.828828">
<ele>1050</ele>
<time>2026-06-19T00:10:22Z</time></trkpt>
<trkpt lat="45.732977" lon="5.82806">
<ele>1057</ele>
<time>2026-06-19T00:12:12Z</time></trkpt>
<trkpt lat="45.733274" lon="5.827756">
<ele>1056</ele>
<time>2026-06-19T00:13:08Z</time></trkpt>
<trkpt lat="45.733221" lon="5.827155">
<ele>1064</ele>
<time>2026-06-19T00:14:11Z</time></trkpt>
<trkpt lat="45.733136" lon="5.826821">
<ele>1069</ele>
<time>2026-06-19T00:14:47Z</time></trkpt>
<trkpt lat="45.733317" lon="5.826623">
<ele>1066</ele>
<time>2026-06-19T00:15:20Z</time></trkpt>
<trkpt lat="45.733433" lon="5.826341">
<ele>1066</ele>
<time>2026-06-19T00:15:47Z</time></trkpt>
<trkpt lat="45.733451" lon="5.826043">
<ele>1070</ele>
<time>2026-06-19T00:16:02Z</time></trkpt>
<trkpt lat="45.733641" lon="5.826058">
<ele>1065</ele>
<time>2026-06-19T00:16:15Z</time></trkpt>
<trkpt lat="45.733838" lon="5.826045">
<ele>1060</ele>
<time>2026-06-19T00:16:29Z</time></trkpt>
<trkpt lat="45.734023" lon="5.826079">
<ele>1054</ele>
<time>2026-06-19T00:16:47Z</time></trkpt>
<trkpt lat="45.734169" lon="5.826207">
<ele>1048</ele>
<time>2026-06-19T00:17:17Z</time></trkpt>
<trkpt lat="45.734278" lon="5.826357">
<ele>1042</ele>
<time>2026-06-19T00:17:44Z</time></trkpt>
<trkpt lat="45.734328" lon="5.826561">
<ele>1038</ele>
<time>2026-06-19T00:18:11Z</time></trkpt>
<trkpt lat="45.734413" lon="5.826722">
<ele>1034</ele>
<time>2026-06-19T00:18:36Z</time></trkpt>
<trkpt lat="45.734603" lon="5.826691">
<ele>1029</ele>
<time>2026-06-19T00:19:10Z</time></trkpt>
<trkpt lat="45.734923" lon="5.826838">
<ele>1017</ele>
<time>2026-06-19T00:20:08Z</time></trkpt>
<trkpt lat="45.735079" lon="5.826797">
<ele>1013</ele>
<time>2026-06-19T00:20:36Z</time></trkpt>
<trkpt lat="45.735289" lon="5.826794">
<ele>1007</ele>
<time>2026-06-19T00:21:12Z</time></trkpt>
<trkpt lat="45.73543" lon="5.826766">
<ele>1004</ele>
<time>2026-06-19T00:21:38Z</time></trkpt>
<trkpt lat="45.735547" lon="5.826796">
<ele>999</ele>
<time>2026-06-19T00:22:01Z</time></trkpt>
<trkpt lat="45.7356" lon="5.826893">
<ele>995</ele>
<time>2026-06-19T00:22:18Z</time></trkpt>
<trkpt lat="45.7358" lon="5.827083">
<ele>984</ele>
<time>2026-06-19T00:23:04Z</time></trkpt>
<trkpt lat="45.735887" lon="5.827103">
<ele>980</ele>
<time>2026-06-19T00:23:21Z</time></trkpt>
<trkpt lat="45.735962" lon="5.827085">
<ele>977</ele>
<time>2026-06-19T00:23:36Z</time></trkpt>
<trkpt lat="45.736007" lon="5.826979">
<ele>977</ele>
<time>2026-06-19T00:23:53Z</time></trkpt>
<trkpt lat="45.736056" lon="5.82696">
<ele>975</ele>
<time>2026-06-19T00:24:03Z</time></trkpt>
<trkpt lat="45.736099" lon="5.827084">
<ele>971</ele>
<time>2026-06-19T00:24:24Z</time></trkpt>
<trkpt lat="45.736135" lon="5.827101">
<ele>968</ele>
<time>2026-06-19T00:24:33Z</time></trkpt>
<trkpt lat="45.736309" lon="5.826878">
<ele>958</ele>
<time>2026-06-19T00:25:23Z</time></trkpt>
<trkpt lat="45.736368" lon="5.826673">
<ele>956</ele>
<time>2026-06-19T00:25:57Z</time></trkpt>
<trkpt lat="45.736429" lon="5.826621">
<ele>952</ele>
<time>2026-06-19T00:26:13Z</time></trkpt>
<trkpt lat="45.736471" lon="5.82661">
<ele>949</ele>
<time>2026-06-19T00:26:22Z</time></trkpt>
<trkpt lat="45.736531" lon="5.826688">
<ele>941</ele>
<time>2026-06-19T00:26:40Z</time></trkpt>
<trkpt lat="45.736624" lon="5.826657">
<ele>934</ele>
<time>2026-06-19T00:26:59Z</time></trkpt>
<trkpt lat="45.736845" lon="5.826508">
<ele>926</ele>
<time>2026-06-19T00:27:33Z</time></trkpt>
<trkpt lat="45.737077" lon="5.82638">
<ele>920</ele>
<time>2026-06-19T00:28:07Z</time></trkpt>
<trkpt lat="45.737184" lon="5.826188">
<ele>923</ele>
<time>2026-06-19T00:28:31Z</time></trkpt>
<trkpt lat="45.737315" lon="5.826043">
<ele>923</ele>
<time>2026-06-19T00:28:55Z</time></trkpt>
<trkpt lat="45.737437" lon="5.826038">
<ele>917</ele>
<time>2026-06-19T00:29:15Z</time></trkpt>
<trkpt lat="45.737592" lon="5.82593">
<ele>914</ele>
<time>2026-06-19T00:29:42Z</time></trkpt>
<trkpt lat="45.737767" lon="5.825939">
<ele>907</ele>
<time>2026-06-19T00:30:10Z</time></trkpt>
<trkpt lat="45.737944" lon="5.82581">
<ele>905</ele>
<time>2026-06-19T00:30:42Z</time></trkpt>
<trkpt lat="45.738173" lon="5.825832">
<ele>901</ele>
<time>2026-06-19T00:31:18Z</time></trkpt>
<trkpt lat="45.738259" lon="5.825873">
<ele>899</ele>
<time>2026-06-19T00:31:32Z</time></trkpt>
<trkpt lat="45.738408" lon="5.826131">
<ele>893</ele>
<time>2026-06-19T00:32:07Z</time></trkpt>
<trkpt lat="45.738465" lon="5.826338">
<ele>890</ele>
<time>2026-06-19T00:32:31Z</time></trkpt>
<trkpt lat="45.738579" lon="5.826496">
<ele>886</ele>
<time>2026-06-19T00:32:55Z</time></trkpt>
<trkpt lat="45.738764" lon="5.826407">
<ele>885</ele>
<time>2026-06-19T00:33:12Z</time></trkpt>
<trkpt lat="45.739116" lon="5.826353">
<ele>878</ele>
<time>2026-06-19T00:33:38Z</time></trkpt>
<trkpt lat="45.73932" lon="5.826168">
<ele>877</ele>
<time>2026-06-19T00:33:55Z</time></trkpt>
<trkpt lat="45.739466" lon="5.825989">
<ele>877</ele>
<time>2026-06-19T00:34:22Z</time></trkpt>
<trkpt lat="45.739665" lon="5.825667">
<ele>880</ele>
<time>2026-06-19T00:35:14Z</time></trkpt>
<trkpt lat="45.739868" lon="5.825128">
<ele>886</ele>
<time>2026-06-19T00:36:29Z</time></trkpt>
<trkpt lat="45.739967" lon="5.824697">
<ele>892</ele>
<time>2026-06-19T00:37:37Z</time></trkpt>
<trkpt lat="45.740121" lon="5.823787">
<ele>901</ele>
<time>2026-06-19T00:39:31Z</time></trkpt>
<trkpt lat="45.740221" lon="5.823359">
<ele>900</ele>
<time>2026-06-19T00:40:00Z</time></trkpt>
<trkpt lat="45.740283" lon="5.823262">
<ele>898</ele>
<time>2026-06-19T00:40:09Z</time></trkpt>
<trkpt lat="45.740499" lon="5.822582">
<ele>889</ele>
<time>2026-06-19T00:41:27Z</time></trkpt>
<trkpt lat="45.740662" lon="5.822411">
<ele>880</ele>
<time>2026-06-19T00:42:04Z</time></trkpt>
<trkpt lat="45.740789" lon="5.822124">
<ele>870</ele>
<time>2026-06-19T00:42:47Z</time></trkpt>
<trkpt lat="45.740813" lon="5.82166">
<ele>864</ele>
<time>2026-06-19T00:43:15Z</time></trkpt>
<trkpt lat="45.740754" lon="5.82121">
<ele>862</ele>
<time>2026-06-19T00:43:40Z</time></trkpt>
<trkpt lat="45.740708" lon="5.820866">
<ele>861</ele>
<time>2026-06-19T00:44:03Z</time></trkpt>
<trkpt lat="45.740722" lon="5.820313">
<ele>851</ele>
<time>2026-06-19T00:45:16Z</time></trkpt>
<trkpt lat="45.740834" lon="5.81979">
<ele>832</ele>
<time>2026-06-19T00:46:27Z</time></trkpt>
<trkpt lat="45.741118" lon="5.818913">
<ele>825</ele>
<time>2026-06-19T00:47:18Z</time></trkpt>
<trkpt lat="45.74147" lon="5.818519">
<ele>818</ele>
<time>2026-06-19T00:48:20Z</time></trkpt>
<trkpt lat="45.741637" lon="5.818414">
<ele>810</ele>
<time>2026-06-19T00:48:50Z</time></trkpt>
<trkpt lat="45.741793" lon="5.818466">
<ele>807</ele>
<time>2026-06-19T00:49:16Z</time></trkpt>
<trkpt lat="45.741888" lon="5.818336">
<ele>803</ele>
<time>2026-06-19T00:49:37Z</time></trkpt>
<trkpt lat="45.741983" lon="5.818282">
<ele>801</ele>
<time>2026-06-19T00:49:47Z</time></trkpt>
<trkpt lat="45.742154" lon="5.81829">
<ele>802</ele>
<time>2026-06-19T00:50:02Z</time></trkpt>
<trkpt lat="45.742233" lon="5.818237">
<ele>801</ele>
<time>2026-06-19T00:50:10Z</time></trkpt>
<trkpt lat="45.742432" lon="5.81784">
<ele>800</ele>
<time>2026-06-19T00:50:40Z</time></trkpt>
<trkpt lat="45.742572" lon="5.817412">
<ele>799</ele>
<time>2026-06-19T00:51:17Z</time></trkpt>
<trkpt lat="45.742699" lon="5.817173">
<ele>799</ele>
<time>2026-06-19T00:51:44Z</time></trkpt>
<trkpt lat="45.742849" lon="5.81696">
<ele>800</ele>
<time>2026-06-19T00:52:10Z</time></trkpt>
<trkpt lat="45.742928" lon="5.816908">
<ele>801</ele>
<time>2026-06-19T00:52:21Z</time></trkpt>
<trkpt lat="45.743033" lon="5.816946">
<ele>802</ele>
<time>2026-06-19T00:52:35Z</time></trkpt>
<trkpt lat="45.743209" lon="5.817069">
<ele>802</ele>
<time>2026-06-19T00:52:58Z</time></trkpt>
<trkpt lat="45.743285" lon="5.817167">
<ele>800</ele>
<time>2026-06-19T00:53:10Z</time></trkpt>
<trkpt lat="45.743359" lon="5.817177">
<ele>799</ele>
<time>2026-06-19T00:53:19Z</time></trkpt>
<trkpt lat="45.743554" lon="5.817054">
<ele>802</ele>
<time>2026-06-19T00:53:44Z</time></trkpt>
<trkpt lat="45.743871" lon="5.817029">
<ele>807</ele>
<time>2026-06-19T00:54:19Z</time></trkpt>
<trkpt lat="45.74394" lon="5.817098">
<ele>807</ele>
<time>2026-06-19T00:54:27Z</time></trkpt>
<trkpt lat="45.743986" lon="5.81737">
<ele>804</ele>
<time>2026-06-19T00:54:47Z</time></trkpt>
<trkpt lat="45.744094" lon="5.817636">
<ele>805</ele>
<time>2026-06-19T00:55:08Z</time></trkpt>
<trkpt lat="45.744207" lon="5.818069">
<ele>802</ele>
<time>2026-06-19T00:55:51Z</time></trkpt>
<trkpt lat="45.744249" lon="5.818103">
<ele>803</ele>
<time>2026-06-19T00:56:00Z</time></trkpt>
<trkpt lat="45.744352" lon="5.818069">
<ele>808</ele>
<time>2026-06-19T00:56:20Z</time></trkpt>
<trkpt lat="45.744487" lon="5.818207">
<ele>809</ele>
<time>2026-06-19T00:56:51Z</time></trkpt>
<trkpt lat="45.744748" lon="5.818331">
<ele>814</ele>
<time>2026-06-19T00:57:43Z</time></trkpt>
<trkpt lat="45.744887" lon="5.818511">
<ele>813</ele>
<time>2026-06-19T00:58:09Z</time></trkpt>
<trkpt lat="45.744967" lon="5.81868">
<ele>811</ele>
<time>2026-06-19T00:58:22Z</time></trkpt>
<trkpt lat="45.745096" lon="5.818778">
<ele>810</ele>
<time>2026-06-19T00:58:36Z</time></trkpt>
<trkpt lat="45.745177" lon="5.81882">
<ele>809</ele>
<time>2026-06-19T00:58:43Z</time></trkpt>
<trkpt lat="45.74531" lon="5.818815">
<ele>811</ele>
<time>2026-06-19T00:58:55Z</time></trkpt>
<trkpt lat="45.74549" lon="5.818838">
<ele>811</ele>
<time>2026-06-19T00:59:12Z</time></trkpt>
<trkpt lat="45.745557" lon="5.818881">
<ele>810</ele>
<time>2026-06-19T00:59:21Z</time></trkpt>
<trkpt lat="45.745601" lon="5.818882">
<ele>811</ele>
<time>2026-06-19T00:59:27Z</time></trkpt>
<trkpt lat="45.745753" lon="5.818821">
<ele>813</ele>
<time>2026-06-19T00:59:48Z</time></trkpt>
<trkpt lat="45.745881" lon="5.818816">
<ele>813</ele>
<time>2026-06-19T01:00:05Z</time></trkpt>
<trkpt lat="45.746125" lon="5.818738">
<ele>812</ele>
<time>2026-06-19T01:00:39Z</time></trkpt>
<trkpt lat="45.746278" lon="5.818593">
<ele>815</ele>
<time>2026-06-19T01:01:04Z</time></trkpt>
<trkpt lat="45.746392" lon="5.818518">
<ele>816</ele>
<time>2026-06-19T01:01:19Z</time></trkpt>
<trkpt lat="45.746554" lon="5.818451">
<ele>817</ele>
<time>2026-06-19T01:01:38Z</time></trkpt>
<trkpt lat="45.746679" lon="5.818531">
<ele>816</ele>
<time>2026-06-19T01:01:54Z</time></trkpt>
<trkpt lat="45.746708" lon="5.818777">
<ele>814</ele>
<time>2026-06-19T01:02:15Z</time></trkpt>
<trkpt lat="45.746854" lon="5.818983">
<ele>817</ele>
<time>2026-06-19T01:02:39Z</time></trkpt>
<trkpt lat="45.746866" lon="5.819557">
<ele>816</ele>
<time>2026-06-19T01:03:33Z</time></trkpt>
<trkpt lat="45.746992" lon="5.81994">
<ele>820</ele>
<time>2026-06-19T01:04:13Z</time></trkpt>
<trkpt lat="45.74711" lon="5.820191">
<ele>821</ele>
<time>2026-06-19T01:04:45Z</time></trkpt>
<trkpt lat="45.747262" lon="5.820404">
<ele>825</ele>
<time>2026-06-19T01:05:22Z</time></trkpt>
<trkpt lat="45.74745" lon="5.820783">
<ele>828</ele>
<time>2026-06-19T01:06:17Z</time></trkpt>
<trkpt lat="45.747521" lon="5.820983">
<ele>830</ele>
<time>2026-06-19T01:06:44Z</time></trkpt>
<trkpt lat="45.747586" lon="5.821745">
<ele>827</ele>
<time>2026-06-19T01:07:32Z</time></trkpt>
<trkpt lat="45.747586" lon="5.821745">
<ele>827</ele>
<time>2026-06-19T01:07:32Z</time></trkpt>
<trkpt lat="45.747595" lon="5.821842">
<ele>827</ele>
<time>2026-06-19T01:07:38Z</time></trkpt>
<trkpt lat="45.747554" lon="5.822048">
<ele>825</ele>
<time>2026-06-19T01:07:51Z</time></trkpt>
<trkpt lat="45.747566" lon="5.822133">
<ele>824</ele>
<time>2026-06-19T01:07:56Z</time></trkpt>
<trkpt lat="45.747819" lon="5.822138">
<ele>828</ele>
<time>2026-06-19T01:08:15Z</time></trkpt>
<trkpt lat="45.748076" lon="5.822236">
<ele>824</ele>
<time>2026-06-19T01:08:34Z</time></trkpt>
<trkpt lat="45.748179" lon="5.822326">
<ele>820</ele>
<time>2026-06-19T01:08:43Z</time></trkpt>
<trkpt lat="45.748221" lon="5.822407">
<ele>818</ele>
<time>2026-06-19T01:08:48Z</time></trkpt>
<trkpt lat="45.748224" lon="5.82258">
<ele>816</ele>
<time>2026-06-19T01:08:57Z</time></trkpt>
<trkpt lat="45.748157" lon="5.822897">
<ele>817</ele>
<time>2026-06-19T01:09:14Z</time></trkpt>
<trkpt lat="45.7482" lon="5.823111">
<ele>814</ele>
<time>2026-06-19T01:09:26Z</time></trkpt>
<trkpt lat="45.748317" lon="5.823342">
<ele>811</ele>
<time>2026-06-19T01:09:41Z</time></trkpt>
<trkpt lat="45.748479" lon="5.823391">
<ele>808</ele>
<time>2026-06-19T01:09:54Z</time></trkpt>
<trkpt lat="45.748489" lon="5.823509">
<ele>808</ele>
<time>2026-06-19T01:10:04Z</time></trkpt>
<trkpt lat="45.74846" lon="5.82363">
<ele>809</ele>
<time>2026-06-19T01:10:19Z</time></trkpt>
<trkpt lat="45.748358" lon="5.823875">
<ele>814</ele>
<time>2026-06-19T01:10:53Z</time></trkpt>
<trkpt lat="45.748245" lon="5.824035">
<ele>816</ele>
<time>2026-06-19T01:11:20Z</time></trkpt>
<trkpt lat="45.74813" lon="5.824152">
<ele>817</ele>
<time>2026-06-19T01:11:44Z</time></trkpt>
<trkpt lat="45.747972" lon="5.824433">
<ele>814</ele>
<time>2026-06-19T01:12:28Z</time></trkpt>
<trkpt lat="45.747951" lon="5.824789">
<ele>807</ele>
<time>2026-06-19T01:13:13Z</time></trkpt>
<trkpt lat="45.747796" lon="5.825149">
<ele>794</ele>
<time>2026-06-19T01:14:07Z</time></trkpt>
<trkpt lat="45.74773" lon="5.825505">
<ele>788</ele>
<time>2026-06-19T01:14:50Z</time></trkpt>
<trkpt lat="45.747403" lon="5.826078">
<ele>780</ele>
<time>2026-06-19T01:15:59Z</time></trkpt>
<trkpt lat="45.74724" lon="5.826316">
<ele>778</ele>
<time>2026-06-19T01:16:30Z</time></trkpt>
<trkpt lat="45.746969" lon="5.82662">
<ele>765</ele>
<time>2026-06-19T01:17:36Z</time></trkpt>
<trkpt lat="45.746839" lon="5.826808">
<ele>759</ele>
<time>2026-06-19T01:18:11Z</time></trkpt>
<trkpt lat="45.746776" lon="5.827005">
<ele>753</ele>
<time>2026-06-19T01:18:40Z</time></trkpt>
<trkpt lat="45.746784" lon="5.82719">
<ele>748</ele>
<time>2026-06-19T01:19:04Z</time></trkpt>
<trkpt lat="45.746739" lon="5.827303">
<ele>745</ele>
<time>2026-06-19T01:19:10Z</time></trkpt>
<trkpt lat="45.746757" lon="5.827428">
<ele>742</ele>
<time>2026-06-19T01:19:17Z</time></trkpt>
<trkpt lat="45.746726" lon="5.827474">
<ele>740</ele>
<time>2026-06-19T01:19:20Z</time></trkpt>
<trkpt lat="45.746644" lon="5.827469">
<ele>740</ele>
<time>2026-06-19T01:19:25Z</time></trkpt>
<trkpt lat="45.746223" lon="5.827582">
<ele>739</ele>
<time>2026-06-19T01:19:55Z</time></trkpt>
<trkpt lat="45.745929" lon="5.827756">
<ele>740</ele>
<time>2026-06-19T01:20:24Z</time></trkpt>
<trkpt lat="45.745797" lon="5.827894">
<ele>741</ele>
<time>2026-06-19T01:20:40Z</time></trkpt>
<trkpt lat="45.74556" lon="5.828292">
<ele>737</ele>
<time>2026-06-19T01:21:16Z</time></trkpt>
<trkpt lat="45.745471" lon="5.82851">
<ele>734</ele>
<time>2026-06-19T01:21:42Z</time></trkpt>
<trkpt lat="45.745437" lon="5.828715">
<ele>731</ele>
<time>2026-06-19T01:22:06Z</time></trkpt>
<trkpt lat="45.745348" lon="5.828914">
<ele>727</ele>
<time>2026-06-19T01:22:33Z</time></trkpt>
<trkpt lat="45.745263" lon="5.829043">
<ele>722</ele>
<time>2026-06-19T01:22:54Z</time></trkpt>
<trkpt lat="45.745187" lon="5.829095">
<ele>720</ele>
<time>2026-06-19T01:23:07Z</time></trkpt>
<trkpt lat="45.745185" lon="5.829251">
<ele>717</ele>
<time>2026-06-19T01:23:25Z</time></trkpt>
<trkpt lat="45.74529" lon="5.829306">
<ele>716</ele>
<time>2026-06-19T01:23:46Z</time></trkpt>
<trkpt lat="45.74529" lon="5.829306">
<ele>716</ele>
<time>2026-06-19T01:23:46Z</time></trkpt>
<trkpt lat="45.745185" lon="5.829251">
<ele>717</ele>
<time>2026-06-19T01:24:08Z</time></trkpt>
<trkpt lat="45.745187" lon="5.829095">
<ele>720</ele>
<time>2026-06-19T01:24:30Z</time></trkpt>
<trkpt lat="45.745134" lon="5.829057">
<ele>721</ele>
<time>2026-06-19T01:24:41Z</time></trkpt>
<trkpt lat="45.745056" lon="5.828903">
<ele>723</ele>
<time>2026-06-19T01:25:07Z</time></trkpt>
<trkpt lat="45.744983" lon="5.828824">
<ele>723</ele>
<time>2026-06-19T01:25:25Z</time></trkpt>
<trkpt lat="45.744797" lon="5.828729">
<ele>727</ele>
<time>2026-06-19T01:26:04Z</time></trkpt>
<trkpt lat="45.74461" lon="5.828725">
<ele>728</ele>
<time>2026-06-19T01:26:35Z</time></trkpt>
<trkpt lat="45.744178" lon="5.828912">
<ele>731</ele>
<time>2026-06-19T01:27:48Z</time></trkpt>
<trkpt lat="45.743477" lon="5.829078">
<ele>736</ele>
<time>2026-06-19T01:29:30Z</time></trkpt>
<trkpt lat="45.743373" lon="5.82914">
<ele>737</ele>
<time>2026-06-19T01:29:45Z</time></trkpt>
<trkpt lat="45.743134" lon="5.829492">
<ele>739</ele>
<time>2026-06-19T01:30:37Z</time></trkpt>
<trkpt lat="45.74285" lon="5.829778">
<ele>742</ele>
<time>2026-06-19T01:31:36Z</time></trkpt>
<trkpt lat="45.74265" lon="5.829787">
<ele>745</ele>
<time>2026-06-19T01:32:10Z</time></trkpt>
<trkpt lat="45.74234" lon="5.829713">
<ele>749</ele>
<time>2026-06-19T01:32:58Z</time></trkpt>
<trkpt lat="45.741917" lon="5.829482">
<ele>751</ele>
<time>2026-06-19T01:34:03Z</time></trkpt>
<trkpt lat="45.741299" lon="5.829339">
<ele>755</ele>
<time>2026-06-19T01:35:55Z</time></trkpt>
<trkpt lat="45.741031" lon="5.829227">
<ele>759</ele>
<time>2026-06-19T01:36:47Z</time></trkpt>
<trkpt lat="45.740874" lon="5.829241">
<ele>765</ele>
<time>2026-06-19T01:37:22Z</time></trkpt>
<trkpt lat="45.740649" lon="5.829364">
<ele>771</ele>
<time>2026-06-19T01:38:17Z</time></trkpt>
<trkpt lat="45.740492" lon="5.829588">
<ele>772</ele>
<time>2026-06-19T01:39:09Z</time></trkpt>
<trkpt lat="45.740027" lon="5.829494">
<ele>780</ele>
<time>2026-06-19T01:41:02Z</time></trkpt>
<trkpt lat="45.739808" lon="5.8294">
<ele>789</ele>
<time>2026-06-19T01:41:59Z</time></trkpt>
<trkpt lat="45.739711" lon="5.829398">
<ele>792</ele>
<time>2026-06-19T01:42:23Z</time></trkpt>
<trkpt lat="45.739647" lon="5.829521">
<ele>791</ele>
<time>2026-06-19T01:42:50Z</time></trkpt>
<trkpt lat="45.739538" lon="5.829644">
<ele>793</ele>
<time>2026-06-19T01:43:25Z</time></trkpt>
<trkpt lat="45.739449" lon="5.829848">
<ele>791</ele>
<time>2026-06-19T01:44:04Z</time></trkpt>
<trkpt lat="45.739348" lon="5.829952">
<ele>791</ele>
<time>2026-06-19T01:44:32Z</time></trkpt>
<trkpt lat="45.739103" lon="5.830026">
<ele>799</ele>
<time>2026-06-19T01:45:31Z</time></trkpt>
<trkpt lat="45.738716" lon="5.830012">
<ele>812</ele>
<time>2026-06-19T01:47:08Z</time></trkpt>
<trkpt lat="45.73879" lon="5.829371">
<ele>827</ele>
<time>2026-06-19T01:49:21Z</time></trkpt>
<trkpt lat="45.738856" lon="5.829223">
<ele>827</ele>
<time>2026-06-19T01:49:57Z</time></trkpt>
<trkpt lat="45.738862" lon="5.829138">
<ele>828</ele>
<time>2026-06-19T01:50:14Z</time></trkpt>
<trkpt lat="45.738771" lon="5.829106">
<ele>832</ele>
<time>2026-06-19T01:50:38Z</time></trkpt>
<trkpt lat="45.738435" lon="5.829333">
<ele>838</ele>
<time>2026-06-19T01:51:55Z</time></trkpt>
<trkpt lat="45.738315" lon="5.829587">
<ele>836</ele>
<time>2026-06-19T01:52:39Z</time></trkpt>
<trkpt lat="45.738279" lon="5.829611">
<ele>836</ele>
<time>2026-06-19T01:52:47Z</time></trkpt>
<trkpt lat="45.738236" lon="5.829582">
<ele>838</ele>
<time>2026-06-19T01:52:57Z</time></trkpt>
<trkpt lat="45.738209" lon="5.829509">
<ele>841</ele>
<time>2026-06-19T01:53:09Z</time></trkpt>
<trkpt lat="45.738225" lon="5.829386">
<ele>843</ele>
<time>2026-06-19T01:53:25Z</time></trkpt>
<trkpt lat="45.738331" lon="5.829133">
<ele>845</ele>
<time>2026-06-19T01:54:00Z</time></trkpt>
<trkpt lat="45.738445" lon="5.828929">
<ele>844</ele>
<time>2026-06-19T01:54:31Z</time></trkpt>
<trkpt lat="45.738554" lon="5.828446">
<ele>850</ele>
<time>2026-06-19T01:55:31Z</time></trkpt>
<trkpt lat="45.738749" lon="5.828128">
<ele>848</ele>
<time>2026-06-19T01:56:29Z</time></trkpt>
<trkpt lat="45.738612" lon="5.827671">
<ele>860</ele>
<time>2026-06-19T01:57:37Z</time></trkpt>
<trkpt lat="45.738618" lon="5.827526">
<ele>861</ele>
<time>2026-06-19T01:57:57Z</time></trkpt>
<trkpt lat="45.73884" lon="5.827092">
<ele>863</ele>
<time>2026-06-19T01:59:19Z</time></trkpt>
<trkpt lat="45.73884" lon="5.827092">
<ele>863</ele>
<time>2026-06-19T01:59:19Z</time></trkpt>
<trkpt lat="45.738931" lon="5.826913">
<ele>866</ele>
<time>2026-06-19T01:59:53Z</time></trkpt>
<trkpt lat="45.739105" lon="5.826497">
<ele>874</ele>
<time>2026-06-19T02:01:09Z</time></trkpt>
<trkpt lat="45.739116" lon="5.826353">
<ele>878</ele>
<time>2026-06-19T02:01:32Z</time></trkpt>
<trkpt lat="45.738764" lon="5.826407">
<ele>885</ele>
<time>2026-06-19T02:02:54Z</time></trkpt>
<trkpt lat="45.738579" lon="5.826496">
<ele>886</ele>
<time>2026-06-19T02:03:40Z</time></trkpt>
<trkpt lat="45.738465" lon="5.826338">
<ele>890</ele>
<time>2026-06-19T02:04:16Z</time></trkpt>
<trkpt lat="45.738408" lon="5.826131">
<ele>893</ele>
<time>2026-06-19T02:04:54Z</time></trkpt>
<trkpt lat="45.738259" lon="5.825873">
<ele>899</ele>
<time>2026-06-19T02:05:50Z</time></trkpt>
<trkpt lat="45.738173" lon="5.825832">
<ele>901</ele>
<time>2026-06-19T02:06:12Z</time></trkpt>
<trkpt lat="45.737944" lon="5.82581">
<ele>905</ele>
<time>2026-06-19T02:07:07Z</time></trkpt>
<trkpt lat="45.737767" lon="5.825939">
<ele>907</ele>
<time>2026-06-19T02:07:55Z</time></trkpt>
<trkpt lat="45.737592" lon="5.82593">
<ele>914</ele>
<time>2026-06-19T02:08:37Z</time></trkpt>
<trkpt lat="45.737437" lon="5.826038">
<ele>917</ele>
<time>2026-06-19T02:09:19Z</time></trkpt>
<trkpt lat="45.737315" lon="5.826043">
<ele>923</ele>
<time>2026-06-19T02:09:48Z</time></trkpt>
<trkpt lat="45.737184" lon="5.826188">
<ele>923</ele>
<time>2026-06-19T02:10:28Z</time></trkpt>
<trkpt lat="45.737077" lon="5.82638">
<ele>920</ele>
<time>2026-06-19T02:11:19Z</time></trkpt>
<trkpt lat="45.736845" lon="5.826508">
<ele>926</ele>
<time>2026-06-19T02:12:52Z</time></trkpt>
<trkpt lat="45.736624" lon="5.826657">
<ele>934</ele>
<time>2026-06-19T02:14:23Z</time></trkpt>
<trkpt lat="45.736531" lon="5.826688">
<ele>941</ele>
<time>2026-06-19T02:14:58Z</time></trkpt>
<trkpt lat="45.736471" lon="5.82661">
<ele>949</ele>
<time>2026-06-19T02:15:29Z</time></trkpt>
<trkpt lat="45.736429" lon="5.826621">
<ele>952</ele>
<time>2026-06-19T02:15:45Z</time></trkpt>
<trkpt lat="45.736368" lon="5.826673">
<ele>956</ele>
<time>2026-06-19T02:16:10Z</time></trkpt>
<trkpt lat="45.736309" lon="5.826878">
<ele>958</ele>
<time>2026-06-19T02:17:03Z</time></trkpt>
<trkpt lat="45.736135" lon="5.827101">
<ele>968</ele>
<time>2026-06-19T02:18:24Z</time></trkpt>
<trkpt lat="45.736099" lon="5.827084">
<ele>971</ele>
<time>2026-06-19T02:18:37Z</time></trkpt>
<trkpt lat="45.736056" lon="5.82696">
<ele>975</ele>
<time>2026-06-19T02:19:11Z</time></trkpt>
<trkpt lat="45.736007" lon="5.826979">
<ele>977</ele>
<time>2026-06-19T02:19:28Z</time></trkpt>
<trkpt lat="45.735962" lon="5.827085">
<ele>977</ele>
<time>2026-06-19T02:19:58Z</time></trkpt>
<trkpt lat="45.735887" lon="5.827103">
<ele>980</ele>
<time>2026-06-19T02:20:25Z</time></trkpt>
<trkpt lat="45.7358" lon="5.827083">
<ele>984</ele>
<time>2026-06-19T02:20:57Z</time></trkpt>
<trkpt lat="45.7356" lon="5.826893">
<ele>995</ele>
<time>2026-06-19T02:22:27Z</time></trkpt>
<trkpt lat="45.735547" lon="5.826796">
<ele>999</ele>
<time>2026-06-19T02:22:59Z</time></trkpt>
<trkpt lat="45.73543" lon="5.826766">
<ele>1004</ele>
<time>2026-06-19T02:23:43Z</time></trkpt>
<trkpt lat="45.735289" lon="5.826794">
<ele>1007</ele>
<time>2026-06-19T02:24:36Z</time></trkpt>
<trkpt lat="45.735079" lon="5.826797">
<ele>1013</ele>
<time>2026-06-19T02:25:51Z</time></trkpt>
<trkpt lat="45.734923" lon="5.826838">
<ele>1017</ele>
<time>2026-06-19T02:26:40Z</time></trkpt>
<trkpt lat="45.734603" lon="5.826691">
<ele>1029</ele>
<time>2026-06-19T02:28:25Z</time></trkpt>
<trkpt lat="45.734413" lon="5.826722">
<ele>1034</ele>
<time>2026-06-19T02:29:24Z</time></trkpt>
<trkpt lat="45.734328" lon="5.826561">
<ele>1038</ele>
<time>2026-06-19T02:30:09Z</time></trkpt>
<trkpt lat="45.734278" lon="5.826357">
<ele>1042</ele>
<time>2026-06-19T02:30:59Z</time></trkpt>
<trkpt lat="45.734169" lon="5.826207">
<ele>1048</ele>
<time>2026-06-19T02:31:49Z</time></trkpt>
<trkpt lat="45.734023" lon="5.826079">
<ele>1054</ele>
<time>2026-06-19T02:32:45Z</time></trkpt>
<trkpt lat="45.733838" lon="5.826045">
<ele>1060</ele>
<time>2026-06-19T02:33:46Z</time></trkpt>
<trkpt lat="45.733641" lon="5.826058">
<ele>1065</ele>
<time>2026-06-19T02:34:29Z</time></trkpt>
<trkpt lat="45.733451" lon="5.826043">
<ele>1070</ele>
<time>2026-06-19T02:34:56Z</time></trkpt>
<trkpt lat="45.733433" lon="5.826341">
<ele>1066</ele>
<time>2026-06-19T02:35:26Z</time></trkpt>
<trkpt lat="45.733317" lon="5.826623">
<ele>1066</ele>
<time>2026-06-19T02:35:59Z</time></trkpt>
<trkpt lat="45.733136" lon="5.826821">
<ele>1069</ele>
<time>2026-06-19T02:36:30Z</time></trkpt>
<trkpt lat="45.733221" lon="5.827155">
<ele>1064</ele>
<time>2026-06-19T02:37:03Z</time></trkpt>
<trkpt lat="45.733274" lon="5.827756">
<ele>1056</ele>
<time>2026-06-19T02:37:58Z</time></trkpt>
<trkpt lat="45.732977" lon="5.82806">
<ele>1057</ele>
<time>2026-06-19T02:38:30Z</time></trkpt>
<trkpt lat="45.732579" lon="5.828828">
<ele>1050</ele>
<time>2026-06-19T02:39:25Z</time></trkpt>
<trkpt lat="45.732319" lon="5.829239">
<ele>1047</ele>
<time>2026-06-19T02:39:53Z</time></trkpt>
<trkpt lat="45.73217" lon="5.829862">
<ele>1035</ele>
<time>2026-06-19T02:40:48Z</time></trkpt>
<trkpt lat="45.731639" lon="5.830532">
<ele>1026</ele>
<time>2026-06-19T02:42:16Z</time></trkpt>
<trkpt lat="45.731023" lon="5.83117">
<ele>1016</ele>
<time>2026-06-19T02:43:11Z</time></trkpt>
<trkpt lat="45.7308" lon="5.831269">
<ele>1019</ele>
<time>2026-06-19T02:43:29Z</time></trkpt>
<trkpt lat="45.730498" lon="5.83171">
<ele>1011</ele>
<time>2026-06-19T02:44:03Z</time></trkpt>
<trkpt lat="45.730187" lon="5.831457">
<ele>1013</ele>
<time>2026-06-19T02:44:39Z</time></trkpt>
<trkpt lat="45.730187" lon="5.831457">
<ele>1013</ele>
<time>2026-06-19T02:44:39Z</time></trkpt>
<trkpt lat="45.730052" lon="5.831347">
<ele>1009</ele>
<time>2026-06-19T02:44:54Z</time></trkpt>
</trkseg>
</trk>
</gpx>`

  const final = new Array(gpxRawXml1, gpxRawXml2)[Math.floor(Math.random() * 2)];

  console.log(final);

  return new NextResponse(final, {
    headers: { 
      'Content-Type': 'application/xml',
      //'Cache-Control': 'public, max-age=3600'
    },
  });
}