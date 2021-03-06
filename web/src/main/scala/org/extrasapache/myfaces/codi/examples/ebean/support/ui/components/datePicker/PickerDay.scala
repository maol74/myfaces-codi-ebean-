package org.extrasapache.myfaces.codi.examples.ebean.support.ui.components.datePicker

import java.util.Calendar

/**
 *
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 *
 * internal day descriptor for a single day
 */
@serializable
class PickerDay {

  def this(in:Calendar) {
    this()
    this.cal = in
  }

  var cal: Calendar = _
  var holiday: Boolean = false
  var firstDayOfWeek: Boolean = false
  var specialDay: Boolean = false
  var specialDayMetaInfo: String = ""
  var outsideSelectMonth = true
  var readOnly = false
  var specialMarker = ""
  var selected = false

  /*properties for day month year selection*/
  def day: Int = {
    cal.get(Calendar.DAY_OF_MONTH)
  }

  def day_$eq(day: Int) {
    cal.set(Calendar.DAY_OF_MONTH, day)
  }

  def month: Int = {
    cal.get(Calendar.MONTH)
  }

  def month_$eq(month: Int) {
    cal.set(Calendar.MONTH, month)
  }

  def year: Int = {
    cal.get(Calendar.YEAR)
  }

  def year_$eq(year: Int) {
    cal.set(Calendar.YEAR, year)
  }

  def toLong: Long = cal.getTimeInMillis

  override def equals(p1: Any) = p1 match {
    case other: PickerDay => {
      other.day == this.day &&
      other.month == this.month  &&
      other.year == this.year
    }
    case _ => false
  }

}


